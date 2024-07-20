import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../utils/burger-api';
import { TOrdersData } from '@utils-types';
import { handlePending, handleRejected, handleFulfilled } from './commonSlice';

export interface FeedsState {
  feeds: TOrdersData;
}

const initialState: FeedsState = {
  feeds: {
    orders: [],
    total: 0,
    totalToday: 0
  }
};

export const fetchFeeds = createAsyncThunk('feeds/get', getFeedsApi);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    selectFeeds: (sliceState) => sliceState.feeds.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        handlePending();
        state.feeds.orders = [];
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        handleRejected(action);
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        handleFulfilled();
        state.feeds = action.payload;
      });
  }
});

export const { selectFeeds } = feedsSlice.selectors;

export default feedsSlice.reducer;
