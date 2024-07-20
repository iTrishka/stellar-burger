import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from '../../services/store';

import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { Preloader } from '../ui/preloader';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const isLoading = useSelector((state) => state.common.isLoading);

  /** TODO: взять переменные из стора */
  const buns: TIngredient[] = ingredients.filter((item) => item.type === 'bun');
  const mains: TIngredient[] = ingredients.filter(
    (item) => item.type === 'main'
  );
  const sauces: TIngredient[] = ingredients.filter(
    (item) => item.type === 'sauce'
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <BurgerIngredientsUI
          currentTab={currentTab}
          buns={buns}
          mains={mains}
          sauces={sauces}
          titleBunRef={titleBunRef}
          titleMainRef={titleMainRef}
          titleSaucesRef={titleSaucesRef}
          bunsRef={bunsRef}
          mainsRef={mainsRef}
          saucesRef={saucesRef}
          onTabClick={onTabClick}
        />
      )}
    </>
  );
};
