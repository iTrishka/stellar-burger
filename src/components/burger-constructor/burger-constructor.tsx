import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI, Preloader } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { sendOrder, orderSlice } from '../../slices/orderSlicer';
import { checkUserAuth } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector((state) => state.order.constructorItems);

  const orderRequest = useSelector((state) => state.order.orderRequest);

  const orderModalData = useSelector((state) => state.order.orderModalData);

  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    dispatch(checkUserAuth);

    if (user && !user.email) {
      navigate('/login');
    }

    if (user && user.email) {
      const idIngredients = constructorItems.ingredients.map(
        (item) => item._id
      );
      dispatch(
        sendOrder([
          constructorItems.bun._id,
          ...idIngredients,
          constructorItems.bun._id
        ])
      );
    }
  };
  const closeOrderModal = () => {
    dispatch(orderSlice.actions.closeModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
