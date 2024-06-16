import React, { useEffect } from 'react';
import { useSelector } from '../../services/store';
import { Outlet, Navigate } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { useDispatch } from '../../services/store';
import { checkUserAuth } from '../../slices/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { user, isAuthChecked } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  if (!isAuthChecked) {
    // пока идёт чекаут пользователя, показываем прелоадер
    return <Preloader />;
  }

  if (!props.onlyUnAuth && user && !user.email) {
    // если пользователь на странице авторизации и данных в хранилище нет, то делаем редирект
    return <Navigate replace to='/login' />;
  }

  if (props.onlyUnAuth && user && user.email) {
    // если пользователь на странице авторизации и данные есть в хранилище
    return <Navigate replace to='/profile' />;
  }

  return props.children;
};
