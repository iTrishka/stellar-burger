import { expect, test, describe, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import orderSliceReducer, {
  sendOrder,
  getUserOrders,
  addBun,
  addIngredient,
  deleteIngredient,
  getOrderByNumber,
  clearModalData,
  moveIngredient
} from './orderSlicer';

describe('тесты для OrderSlicer', () => {
  const initialOrderState = {
    constructorItems: {
      bun: {
        _id: 'dwedw',
        price: 0
      },
      ingredients: []
    },
    orderRequest: false,
    orderModalData: null,
    orders: []
  };

  test('#3.1 action_проверка отправки заказа', async () => {
    const expectedResult = {
      constructorItems: {
        bun: {
          _id: 'dwedw',
          price: 0
        },
        ingredients: []
      },
      orderRequest: false,
      orderModalData: {
        success: true,
        name: 'Заказ 1',
        order: {
          number: '666'
        }
      },
      orders: []
    };

    (global as any).fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(expectedResult.orderModalData)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { order: orderSliceReducer }
    });

    await store.dispatch(
      sendOrder([
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa093f',
        '643d69a5c3f7b9001cfa093f',
        '643d69a5c3f7b9001cfa093c'
      ])
    );

    const data = store.getState();

    expect(data.order.orderModalData?.number).toEqual(
      expectedResult.orderModalData.order.number
    );
  });

  test('#3.2 action_проверка получения заказов пользователя', async () => {
    const expectedResult = {
      success: true,
      constructorItems: {
        bun: {
          _id: '643d69a5c3f7b9001cfa093c'
        },
        ingredients: [
          { _id: '643d69a5c3f7b9001cfa093f' },
          { _id: '643d69a5c3f7b9001cfa093f' }
        ]
      },
      orderRequest: false,
      orderModalData: null,
      orders: [
        [
          {
            _id: '666f3626856777001bb1b4e9',
            ingredients: ['643d69a5c3f7b9001cfa093e'],
            status: 'done',
            name: 'Люминесцентный бургер',
            createdAt: '2024-06-16T18:59:50.755Z',
            updatedAt: '2024-06-16T18:59:51.291Z',
            number: 42918
          },
          {
            _id: '666f3a57856777001bb1b502',
            ingredients: [
              '643d69a5c3f7b9001cfa0942',
              '643d69a5c3f7b9001cfa0947',
              '643d69a5c3f7b9001cfa0941'
            ],
            status: 'done',
            name: 'Фалленианский spicy био-марсианский бургер',
            createdAt: '2024-06-16T19:17:43.167Z',
            updatedAt: '2024-06-16T19:17:43.544Z',
            number: 42922
          }
        ]
      ]
    };

    (global as any).fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(expectedResult)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { order: orderSliceReducer }
    });

    await store.dispatch(getUserOrders());

    const { orders } = store.getState().order;

    expect(orders).toEqual(expectedResult.orders);
  });

  test('#3.3 action_проверка получения заказа по id', async () => {
    const expectedResult = {
      constructorItems: {
        bun: {
          _id: 'dwedw',
          price: 0
        },
        ingredients: []
      },
      orderRequest: false,
      orderModalData: {
        success: true,
        name: 'Заказ 1',
        order: {
          number: 777
        }
      },
      orders: []
    };

    (global as any).fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            orders: [{ number: 777 }]
          })
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { order: orderSliceReducer }
    });

    await store.dispatch(getOrderByNumber(777));

    const data = store.getState();

    expect(data.order.orderModalData?.number).toEqual(
      expectedResult.orderModalData.order.number
    );
  });

  test('#3.4 reducer_добавить булку в конструктор', async () => {
    const newBun = {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      __v: 0
    };

    const newState = orderSliceReducer(initialOrderState, addBun(newBun));

    const { constructorItems } = newState;

    expect(constructorItems).toEqual({
      bun: newBun,
      ingredients: []
    });
  });

  test('#3.5 reducer_добавление ингредиента в конструктор', async () => {
    const newIngrtgient = {
      _id: '643d69a5c3f7b9001cfa093f',
      name: 'Мясо бессмертных моллюсков Protostomia',
      type: 'main',
      proteins: 433,
      fat: 244,
      carbohydrates: 33,
      calories: 420,
      price: 1337,
      image: 'https://code.s3.yandex.net/react/code/meat-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
      __v: 0
    };

    const newState = orderSliceReducer(
      initialOrderState,
      addIngredient(newIngrtgient)
    );

    const { constructorItems } = newState;

    expect(constructorItems.ingredients[0]._id).toBe(newIngrtgient._id);
    expect(typeof constructorItems.ingredients[0].id).toBe('string');
  });

  test('#3.6 reducer_удаление ингредиента', async () => {
    const initialOrderStateFull = {
      constructorItems: {
        bun: {
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
          __v: 0,
          id: '00008989'
        },
        ingredients: [
          {
            _id: '643d69a5c3f7b9001cfa093f',
            name: 'Мясо бессмертных моллюсков Protostomia',
            type: 'main',
            proteins: 433,
            fat: 244,
            carbohydrates: 33,
            calories: 420,
            price: 1337,
            image: 'https://code.s3.yandex.net/react/code/meat-02.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
            image_large:
              'https://code.s3.yandex.net/react/code/meat-02-large.png',
            __v: 0,
            id: '898989'
          }
        ]
      },
      orderRequest: false,
      orderModalData: null,
      orders: []
    };

    const newState = orderSliceReducer(
      initialOrderStateFull,
      deleteIngredient('898989')
    );

    const { constructorItems } = newState;

    expect(constructorItems).toEqual({
      bun: {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0,
        id: '00008989'
      },
      ingredients: []
    });
  });

  test('#3.7 reducer_очистка данныx из orderModalData', async () => {
    const initialOrderStateWithMOdalDate = {
      constructorItems: {
        bun: {
          _id: 'dwedw',
          price: 0
        },
        ingredients: []
      },
      orderRequest: false,
      orderModalData: {
        name: 'Заказ 1',
        order: {},
        number: 666,
        createdAt: '01.07',
        updatedAt: '02.07',
        _id: '666_666',
        status: 'done',
        ingredients: [],
        owner: {
          createdAt: '01.07',
          email: '666@yandex.ru',
          name: 'name',
          updatedAt: '02.07'
        }
      },
      orders: []
    };

    const newState = orderSliceReducer(
      initialOrderStateWithMOdalDate,
      clearModalData()
    );

    const { orderModalData } = newState;

    expect(orderModalData).toEqual(null);
  });

  test('#3.8 reducer_передвинуть ингредиент в конструкторе', async () => {
    const initialOrderStateFull = {
      constructorItems: {
        bun: {
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
          __v: 0,
          id: '00008989'
        },
        ingredients: [
          {
            _id: '643d69a5c3f7b9001cfa093f',
            name: 'Мясо бессмертных моллюсков Protostomia',
            type: 'main',
            proteins: 433,
            fat: 244,
            carbohydrates: 33,
            calories: 420,
            price: 1337,
            image: 'https://code.s3.yandex.net/react/code/meat-02.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
            image_large:
              'https://code.s3.yandex.net/react/code/meat-02-large.png',
            __v: 0,
            id: '111111'
          },
          {
            _id: '643d69a5c3f7b9001cfa093f',
            name: 'Мясо бессмертных моллюсков Protostomia',
            type: 'main',
            proteins: 433,
            fat: 244,
            carbohydrates: 33,
            calories: 420,
            price: 1337,
            image: 'https://code.s3.yandex.net/react/code/meat-02.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
            image_large:
              'https://code.s3.yandex.net/react/code/meat-02-large.png',
            __v: 0,
            id: '222222'
          },
          {
            _id: '643d69a5c3f7b9001cfa093f',
            name: 'Мясо бессмертных моллюсков Protostomia',
            type: 'main',
            proteins: 433,
            fat: 244,
            carbohydrates: 33,
            calories: 420,
            price: 1337,
            image: 'https://code.s3.yandex.net/react/code/meat-02.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
            image_large:
              'https://code.s3.yandex.net/react/code/meat-02-large.png',
            __v: 0,
            id: '333333'
          }
        ]
      },
      orderRequest: false,
      orderModalData: null,
      orders: []
    };

    const newState = orderSliceReducer(
      initialOrderStateFull,
      moveIngredient({
        currentIndex: 2,
        newIndex: 1
      })
    );

    const { constructorItems } = newState;

    expect(constructorItems.ingredients).toEqual([
      {
        _id: '643d69a5c3f7b9001cfa093f',
        name: 'Мясо бессмертных моллюсков Protostomia',
        type: 'main',
        proteins: 433,
        fat: 244,
        carbohydrates: 33,
        calories: 420,
        price: 1337,
        image: 'https://code.s3.yandex.net/react/code/meat-02.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
        __v: 0,
        id: '111111'
      },
      {
        _id: '643d69a5c3f7b9001cfa093f',
        name: 'Мясо бессмертных моллюсков Protostomia',
        type: 'main',
        proteins: 433,
        fat: 244,
        carbohydrates: 33,
        calories: 420,
        price: 1337,
        image: 'https://code.s3.yandex.net/react/code/meat-02.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
        __v: 0,
        id: '333333'
      },
      {
        _id: '643d69a5c3f7b9001cfa093f',
        name: 'Мясо бессмертных моллюсков Protostomia',
        type: 'main',
        proteins: 433,
        fat: 244,
        carbohydrates: 33,
        calories: 420,
        price: 1337,
        image: 'https://code.s3.yandex.net/react/code/meat-02.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
        __v: 0,
        id: '222222'
      }
    ]);
  });
});
