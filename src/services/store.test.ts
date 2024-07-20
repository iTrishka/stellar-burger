import { rootReducer } from './store';

describe('rootReducer', () => {
  test('проверка правильной инициализации rootReducer', () => {
    const expectedReducers = {
      ingredients: {
        ingredients: [],
      },
      feeds: {
        feeds: {
          orders: [],
          total: 0,
          totalToday: 0
        }
      },
      user: {
        isAuthChecked: false,
        isAuthenticated: false,
        user: {
          email: '',
          name: ' '
        }
      },
      order: {
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
      },
      common: {
        error: null,
        isLoading: false
      }
    };

    const actualReducers = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(actualReducers).toEqual(expectedReducers);
  });
});
