import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../utils/burger-api';
import { TConstructorIngredient } from '@utils-types';
import { TOrder } from '@utils-types';

interface OrderState {
  constructorItems: {
    bun:
      | TConstructorIngredient
      | {
          _id: string;
          price: number;
        };
    ingredients: TConstructorIngredient[] | [];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  constructorItems: {
    bun: {
      _id: 'dwedw',
      price: 0
    },
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  isLoading: false,
  error: null
};

export const sendOrder = createAsyncThunk(
  'order/sendOrder',
  async (data: string[]) => await orderBurgerApi(data)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addBun(state, action) {
      state.constructorItems.bun = action.payload;
    },
    addIngredient(state, action) {
      state.constructorItems.ingredients = [
        action.payload,
        ...state.constructorItems.ingredients
      ];
    },
    deleteIngredient(state, action) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item, index) => index !== action.payload.index
        );
    },
    closeModal(state) {
      state.orderModalData = null;
      state.constructorItems = {
        bun: {
          _id: 'dwedw',
          price: 0
        },
        ingredients: []
      };
    }
  },
  selectors: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state, action) => {
        console.log('sendOrder1');
        state.isLoading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(sendOrder.rejected, (state, action) => {
        console.log('sendOrder2');
        state.isLoading = false;
        state.error = action.error.message || null;
        state.orderRequest = false;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        console.log('sendOrder3');
        state.isLoading = false;
        state.error = null;
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      });
  }
});

export const state = orderSlice.selectors;

export default orderSlice.reducer;
