import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import { orderSlice } from '../../services/orderSlicer';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(
        orderSlice.actions.moveIngredient({
          currentIndex: index,
          newIndex: index + 1
        })
      );
    };

    const handleMoveUp = () => {
      dispatch(
        orderSlice.actions.moveIngredient({
          currentIndex: index,
          newIndex: index - 1
        })
      );
    };

    const handleClose = () => {
      dispatch(orderSlice.actions.deleteIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
