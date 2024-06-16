import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  updateUserApi,
  getUserApi
} from '../utils/burger-api';
import { TUser } from '@utils-types';
import { useSelector } from '../services/store';

interface UserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: TUser;
  isLoading: boolean;
  error: string | null;
}

interface TRegisterData {
  email: string;
  name: string;
  password: string;
}

const initialState: UserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: {
    email: '',
    name: ''
  },
  isLoading: false,
  error: null
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ name, email, password }: TRegisterData) =>
    await registerUserApi({ name, email, password })
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: Omit<TRegisterData, 'name'>) =>
    await loginUserApi({ email, password })
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async () => await logoutApi()
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async () => await getUserApi()
);

export const updateUserInfo = createAsyncThunk(
  'user/updateUserInfo',
  async (data: TRegisterData) => await updateUserApi(data)
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectUser: (sliceState) => sliceState.user,
    authenticatedSelector: (sliceState) => sliceState.isAuthenticated
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        console.log('loginUser1');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log('loginUser2');
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('loginUser3', action.payload.user);
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        console.log('loginUser3 after', action.payload.user);
      })
      .addCase(registerUser.pending, (state) => {
        console.log('registerUser1');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.log('registerUser2');
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log('registerUser3');
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(logoutUser.pending, (state, action) => {
        console.log('logoutUser1');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        console.log('logoutUser2');
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        console.log('logoutUser3');
        state.isLoading = false;
        state.user = {
          email: '',
          name: ''
        };
        state.error = null;
      })
      .addCase(checkUserAuth.pending, (state, action) => {
        console.log('checkUserAuth1');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        console.log('checkUserAuth2');
        state.isLoading = false;
        state.error = action.error.message || null;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        console.log('checkUserAuth3');
        state.isLoading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(updateUserInfo.pending, (state, action) => {
        console.log('updateUserInfo1');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        console.log('updateUserInfo2');
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        console.log('updateUserInfo3');
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.user;
      });
  }
});

export const { selectUser, authenticatedSelector } = userSlice.selectors;

export default userSlice.reducer;
