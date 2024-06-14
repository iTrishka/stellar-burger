import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserApi } from '../utils/burger-api';
import { TUser } from '@utils-types';
import { getCookie } from 'src/utils/cookie';

interface UserState {
  isAuthChecked: boolean;
  user: TUser;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isAuthChecked: false,
  user: {
    email: '',
    name: ''
  },
  isLoading: false,
  error: null
};

export const fetchUser = createAsyncThunk(
  'user/get',
  async () => await getUserApi()
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // authChecked: (state) => {
    //   state.isAuthChecked = true;
    // }
  },
  selectors: {
    selectUser: (sliceState) => sliceState.user,
    selectIsAuthChecked: (sliceState) => sliceState.isAuthChecked
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        console.log('fetchUser1');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        console.log('fetchUser2');
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        console.log('fetchUser3');
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      });
  }
});

export const { selectUser, selectIsAuthChecked } = userSlice.selectors;

export default userSlice.reducer;
