import { expect, test, describe, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import feedsSliceReducer, { fetchFeeds } from './feedsSlice';

describe('тесты FeedSlice', () => {
  test('проверка получения всех заказов', async () => {
    const expectedResult = {
      success: true,
      orders: [
        {
          _id: '669b8300119d45001b4fa396',
          ingredients: [
            '643d69a5c3f7b9001cfa093d',
            '643d69a5c3f7b9001cfa0940',
            '643d69a5c3f7b9001cfa093e',
            '643d69a5c3f7b9001cfa093e',
            '643d69a5c3f7b9001cfa0940',
            '643d69a5c3f7b9001cfa0940'
          ],
          status: 'done',
          name: 'Флюоресцентный люминесцентный метеоритный бургер',
          createdAt: '2024-07-20T09:27:28.230Z',
          updatedAt: '2024-07-20T09:27:28.693Z',
          number: 46554
        },
        {
          _id: '669b77c8119d45001b4fa37b',
          ingredients: [
            '643d69a5c3f7b9001cfa0949',
            '643d69a5c3f7b9001cfa0941',
            '643d69a5c3f7b9001cfa093c',
            '643d69a5c3f7b9001cfa093c'
          ],
          status: 'done',
          name: 'Краторный экзо-плантаго био-марсианский бургер',
          createdAt: '2024-07-20T08:39:36.168Z',
          updatedAt: '2024-07-20T08:39:36.626Z',
          number: 46553
        }
      ],
      total: 46180,
      totalToday: 122
    };

    (global as any).fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(expectedResult)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { data: feedsSliceReducer }
    });

    await store.dispatch(fetchFeeds());

    const { feeds } = store.getState().data;

    expect(feeds).toEqual(expectedResult);
  });
});
