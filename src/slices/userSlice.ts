import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  updateUserApi,
  getUserApi
} from '../utils/burger-api';
import { TUser } from '@utils-types';

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
    name: ' '
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

export const getUser = createAsyncThunk(
  'user/getUser',
  async () => await getUserApi()
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
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(logoutUser.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          email: '',
          name: ''
        };
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(checkUserAuth.pending, (state, action) => {
        state.isLoading = true;
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(updateUserInfo.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.user;
      })
      .addCase(getUser.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.user;
      });
  }
});

export const { selectUser, authenticatedSelector } = userSlice.selectors;

export default userSlice.reducer;
