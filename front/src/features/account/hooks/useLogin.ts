import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES, ERRORS, slugify, type ApiError, HTTP_STATUS } from '@/shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContext } from '@/features/account/context';
import {
  loginSchema,
  type LoginFormData,
} from '@/features/account/validations';
import { competitionService } from '@/features/competition/services';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const [globalError, setGlobalError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, logout } = useAuthContext();

  const joinCode = searchParams.get('code');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
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
      await login(data);

      if (joinCode) {
        try {
          await competitionService.join(joinCode);
          navigate(ROUTES.NAV.COMPETITION_DETAIL(joinCode), { replace: true });
        } catch (e: unknown) {
          const apiError = e as ApiError;
          toast.error(
            apiError.message || ERRORS.COMPETITION.NOT_FOUND(joinCode),
          );
          navigate(ROUTES.NAV.DASHBOARD, { replace: true });
        }
      } else {
        navigate(ROUTES.NAV.DASHBOARD, { replace: true });
      }
    } catch (e: unknown) {
      const apiError = e as ApiError;

      const errorMessage =
        apiError.status === HTTP_STATUS.UNAUTHORIZED
          ? ERRORS.AUTH.INVALID_CREDENTIALS
          : apiError.message || ERRORS.NETWORK.SERVER;

      setGlobalError(errorMessage);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('username', slugify(e.target.value), { shouldValidate: false });
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
