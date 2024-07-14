import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { useLocation } from 'react-router-dom';

export const AppHeader: FC = () => {
  const location = useLocation();
  const userNameStore = useSelector((state) => state.user.user.name);
  return (
    <AppHeaderUI
      userName={userNameStore ? userNameStore : ''}
      path={location.pathname}
    />
  );
};
