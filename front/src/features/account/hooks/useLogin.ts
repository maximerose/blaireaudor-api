import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, ERRORS, slugify } from '@/shared';
import {
  useAuthContext,
  loginSchema,
  type LoginFormData,
} from '@/features/account';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const useLogin = () => {
  const [globalError, setGlobalError] = useState('');
  const navigate = useNavigate();
  const { login, logout } = useAuthContext();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    logout();
  }, [logout]);

  const onSubmit = async (data: LoginFormData) => {
    setGlobalError('');

    try {
      const response = await login(data);

      if (response.ok) {
        navigate(ROUTES.NAV.DASHBOARD);
      } else {
        setGlobalError(ERRORS.AUTH.INVALID_CREDENTIALS);
      }
    } catch {
      setGlobalError(ERRORS.NETWORK.SERVER);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('username', slugify(e.target.value), { shouldValidate: true });
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    handleUsernameChange,
    setValue,
    errors,
    globalError,
    isSubmitting,
  };
};
