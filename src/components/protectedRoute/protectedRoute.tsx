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
  console.log('isAuthChecked', isAuthChecked);
  console.log('onlyUnAuth', props.onlyUnAuth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  if (!isAuthChecked) {
    // пока идёт чекаут пользователя, показываем прелоадер
    console.log('Preloader');
    return <Preloader />;
  }

  if (!props.onlyUnAuth && user && !user.email) {
    // если пользователь на странице авторизации и данных в хранилище нет, то делаем редирект
    console.log(11);
    return <Navigate replace to='/login' />;
  }

  if (props.onlyUnAuth && user && user.email) {
    // если пользователь на странице авторизации и данные есть в хранилище
    console.log(22);
    return <Navigate replace to='/profile' />;
  }

  console.log('return children');
  return props.children;
};
