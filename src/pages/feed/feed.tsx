import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

import { useSelector } from '../../services/store';
import { useDispatch } from '../../services/store';
import { fetchFeeds } from '../../slices/feedsSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const orders: TOrder[] = useSelector((state) => state.feeds.feeds.orders);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  console.log('Feed', orders);

  if (!orders.length) {
    return <Preloader />;
  } else {
    return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
  }
};
