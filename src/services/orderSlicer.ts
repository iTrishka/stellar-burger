import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  orderBurgerApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../utils/burger-api';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { TOrder } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';
import { handlePending, handleRejected, handleFulfilled } from './commonSlice';

interface OrderState {
  constructorItems: {
    bun:
      | TConstructorIngredient
      | {
          _id: string;
          price: number;
        };
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
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
  orders: []
};

export const sendOrder = createAsyncThunk('order/sendOrder', orderBurgerApi);

export const getUserOrders = createAsyncThunk(
  'order/getUserOrders',
  getOrdersApi
);

export const getOrders = createAsyncThunk('order/getUserOrders', getOrdersApi);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  getOrderByNumberApi
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addBun(state, action) {
      state.constructorItems.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.constructorItems.ingredients.push(action.payload);
      },
      prepare: (item: TIngredient) => {
        const id = uuidv4();
        return { payload: { id, ...item } };
      }
    },
    deleteIngredient(state, action) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload.id
        );
    },
    clearModalData(state) {
      state.orderModalData = null;
    }
  },
  selectors: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.orderRequest = true;
        handlePending();
      })
      .addCase(sendOrder.rejected, (state, action) => {
        handleRejected(action);
        state.orderRequest = false;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        handleFulfilled();
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
        state.constructorItems = initialState.constructorItems;
      })
      .addCase(getUserOrders.pending, (state, action) => {
        handlePending();
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        handleRejected(action);
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        handleFulfilled();
        state.orders = action.payload;
      })
      .addCase(getOrderByNumber.pending, (state, action) => {
        handlePending();
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        handleRejected(action);
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        handleFulfilled();
        state.orderModalData = action.payload.orders[0];
      });
  }
});

export const state = orderSlice.selectors;

export const { addBun, addIngredient, deleteIngredient, clearModalData } =
  orderSlice.actions;

export default orderSlice.reducer;
