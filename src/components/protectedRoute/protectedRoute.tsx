import React, { useEffect } from 'react';
import { useSelector } from '../../services/store';
import { Navigate } from 'react-router-dom';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { user, isLoading } = useSelector((state) => state.user);

  if (isLoading) {
    return <Preloader />;
  }

  if (!props.onlyUnAuth && user && !user.email) {
    // если пользователь на странице авторизации и данных в хранилище нет, то делаем редирект
    return <Navigate replace to='/login' />;
  }

  if (props.onlyUnAuth && user && user.email) {
    return <Navigate replace to='/profile' />;
  }

  return props.children;
};
