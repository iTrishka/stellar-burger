import React, { useEffect } from 'react';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { useDispatch } from '../../services/store';
import { checkUserAuth } from '../../slices/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { user, isAuthChecked, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!isAuthenticated && !props.onlyUnAuth && user && !user.email) {
    // если пользователь на защищенной сранице и данных в хранилище нет, то делаем редирект
    return <Navigate replace to='/login' />;
  }

  if (isAuthChecked && props.onlyUnAuth && user && user.email) {
    // если пользователь на странице авторизации и данные есть в хранилище
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return props.children;
};
