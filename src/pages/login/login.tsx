import { useEffect } from 'react';
import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { Navigate } from 'react-router-dom';

import { useDispatch } from '../../services/store';
import { useSelector } from '../../services/store';

import { loginUser } from '../../slices/userSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};