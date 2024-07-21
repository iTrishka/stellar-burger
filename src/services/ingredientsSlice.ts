import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../utils/burger-api';
import { TIngredient } from '@utils-types';
import { handlePending, handleRejected, handleFulfilled } from './commonSlice';

interface IngredientsState {
  ingredients: TIngredient[];
}

const initialState: IngredientsState = {
  ingredients: []
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (sliceState) => sliceState.ingredients
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        handlePending();
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        handleRejected(action);
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        handleFulfilled();
        state.ingredients = action.payload;
      });
  }
});

export const { selectIngredients } = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
