import { error } from 'console';
import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

type TServerResponse<T> = {
  success: boolean;
} & T;

// объявляем базовый урл
const BASE_URL = process.env.BURGER_API_URL;

// создаем функцию проверки ответа на `ok`
const checkResponse = <T>(res: Response) =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

// создаем функцию проверки на `success`
export const checkSuccess = (data: any) => {
  if (data && data?.success) return data;
  return Promise.reject(data);
};

// создаем универсальную фукнцию запроса с проверкой ответа и `success`
export const request = <T>(endpoint: RequestInfo, options: RequestInit = {}) =>
  fetch(`${BASE_URL}/${endpoint}`, options)
    .then((res) => checkResponse(res))
    .then((data) => checkSuccess(data))
    .catch((error) => console.log('error', error));

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${BASE_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

export const fetchWithRefresh = async <T>(
  endpoint: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(`${BASE_URL}/${endpoint}`, options);
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

type TOrdersResponse = TServerResponse<{
  data: TOrder[];
}>;

export const getIngredientsApi = () =>
  request<TIngredientsResponse>('ingredients').then((data) => data.data);

export const getFeedsApi = () => request<TFeedsResponse>('orders/all');

export const getOrdersApi = () =>
  fetchWithRefresh<TOrderResponse>(`orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  })
    .then((data) => checkSuccess(data))
    .then((data) => data.orders);

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  }).then((data) => checkSuccess(data));

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number) =>
  request<TOrderResponse>(`orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = (data: TRegisterData) =>
  request<TAuthResponse>(`auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) =>
  request<TAuthResponse>(`auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((data) => {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    })
    .catch((error) => console.log(error));

export const forgotPasswordApi = (data: { email: string }) =>
  request<TServerResponse<{}>>(`password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  request<TServerResponse<{}>>(`password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`auth/user`, {
    headers: {
      authorization: getCookie('accessToken')
    } as HeadersInit
  });

export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(`auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });

export const logoutApi = () =>
  request<TServerResponse<{}>>(`auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((data) => {
    setCookie('accessToken', '');
    localStorage.removeItem('refreshToken');
    return data;
  });
