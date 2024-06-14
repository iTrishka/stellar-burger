import { FC } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const location = useLocation();
  /** (DONE) TODO: взять переменную из стора */
  let { id } = useParams();

  const ingredientData = useSelector(
    (state) =>
      state.ingredients.ingredients.filter((item) => item._id === id)[0]
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
