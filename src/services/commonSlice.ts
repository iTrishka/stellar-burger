import { createSlice } from '@reduxjs/toolkit';

interface TCommonState {
  isLoading: boolean;
  error: string | null;
}

const initialState: TCommonState = {
  isLoading: false,
  error: null
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    handlePending(state) {
      state.isLoading = true;
      state.error = null;
    },
    handleRejected(state, action) {
      state.isLoading = false;
      state.error = action.payload || null;
    },
    handleFulfilled(state) {
      state.isLoading = false;
      state.error = null;
    }
  }
});

export const {
  setLoading,
  setError,
  handlePending,
  handleRejected,
  handleFulfilled
} = commonSlice.actions;

export default commonSlice.reducer;
