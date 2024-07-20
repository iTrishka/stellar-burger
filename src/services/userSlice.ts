import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  updateUserApi,
  getUserApi
} from '../utils/burger-api';
import { TUser } from '@utils-types';
import { handlePending, handleRejected, handleFulfilled } from './commonSlice';

interface UserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: TUser;
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
  }
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  registerUserApi
);

export const loginUser = createAsyncThunk('user/loginUser', loginUserApi);

export const logoutUser = createAsyncThunk('user/logoutUser', logoutApi);

export const checkUserAuth = createAsyncThunk('user/checkUserAuth', getUserApi);

export const updateUserInfo = createAsyncThunk(
  'user/updateUserInfo',
  updateUserApi
);

export const getUser = createAsyncThunk('user/getUser', getUserApi);

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
        handlePending();
      })
      .addCase(loginUser.rejected, (state, action) => {
        handleRejected(action);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        handleFulfilled();
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        handlePending();
      })
      .addCase(registerUser.rejected, (state, action) => {
        handleRejected(action);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        handleFulfilled();
        state.user = action.payload.user;
      })
      .addCase(logoutUser.pending, (state) => {
        handlePending();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        handleRejected(action);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        handleFulfilled();
        state.user = {
          email: '',
          name: ''
        };
        state.isAuthenticated = false;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
        handlePending();
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        handleRejected(action);
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(checkUserAuth.fulfilled, (state) => {
        handleFulfilled();
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(updateUserInfo.pending, (state) => {
        handlePending();
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        handleRejected(action);
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        handleFulfilled();
        state.user = action.payload.user;
      })
      .addCase(getUser.pending, (state) => {
        handlePending();
      })
      .addCase(getUser.rejected, (state, action) => {
        handleRejected(action);
      })
      .addCase(getUser.fulfilled, (state, action) => {
        handleFulfilled();
        state.user = action.payload.user;
      });
  }
});

export const { selectUser, authenticatedSelector } = userSlice.selectors;

export default userSlice.reducer;
