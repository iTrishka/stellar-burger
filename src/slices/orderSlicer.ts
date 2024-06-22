import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  orderBurgerApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../utils/burger-api';
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
  orders: TOrder[] | [];
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
  error: null,
  orders: []
};

export const sendOrder = createAsyncThunk(
  'order/sendOrder',
  async (data: string[]) => await orderBurgerApi(data)
);

export const getUserOrders = createAsyncThunk(
  'order/getUserOrders',
  async () => await getOrdersApi()
);

export const getOrders = createAsyncThunk(
  'order/getUserOrders',
  async () => await getOrdersApi()
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (arg: number) => await getOrderByNumberApi(arg)
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
        state.isLoading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
        state.orderRequest = false;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(getUserOrders.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.orders = action.payload;
      })
      .addCase(getOrderByNumber.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.orderModalData = action.payload.orders[0];
      });
  }
});

export const state = orderSlice.selectors;

export default orderSlice.reducer;
