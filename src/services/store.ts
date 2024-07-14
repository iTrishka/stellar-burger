import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsSliceReducer from './ingredientsSlice';
import feedsSliceReducer from './feedsSlice';
import userSliceReducer from './userSlice';
import orderSlicer from './orderSlicer';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  ingredients: ingredientsSliceReducer,
  feeds: feedsSliceReducer,
  user: userSliceReducer,
  order: orderSlicer
}); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
