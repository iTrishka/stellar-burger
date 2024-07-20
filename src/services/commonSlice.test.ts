import { expect, test, describe, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';

import commonSliceReducer, { setLoading, setError, handlePending, handleRejected, handleFulfilled } from './commonSlice';



describe('тесты для commonSlice', () => {

  test('#0.1 reducer_изменение isLoading и error при Pending', async () => {
    const initialState = { isLoading: false, error: null };

    const newState = commonSliceReducer(
      initialState,
      handlePending()
    );

    expect(newState.isLoading).toEqual(true);
    expect(newState.error).toEqual(null);
  });

  test('#0.2 reducer_изменение isLoading и error при Rejected', async () => {
    const initialState = { isLoading: false, error: null };

    const newState = commonSliceReducer(
      initialState,
      handleRejected("Error #1")
    );

    expect(newState.isLoading).toEqual(false);
    expect(newState.error).toEqual("Error #1");
  });

  test('#0.3 reducer_изменение isLoading и error при Fulfilled', async () => {
    const initialState = { isLoading: false, error: null };

    const newState = commonSliceReducer(
      initialState,
      handleFulfilled()
    );

    expect(newState.isLoading).toEqual(false);
    expect(newState.error).toEqual(null);
  });

});

