import { useAuthContext } from '@/features/account/context/AuthContext';
import {
  loginSchema,
  type LoginFormData,
} from '@/features/account/validations';
import { competitionService } from '@/features/competition/services';
import {
  ERRORS,
  HTTP_STATUS,
  ROUTES,
  handleApiError,
  type ApiError,
} from '@/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, logout } = useAuthContext();

  const joinCode = searchParams.get('code');

  const {
    register,
    handleSubmit,
    setValue,
    setError,
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
    try {
      await login(data);

      if (joinCode) {
        try {
          await competitionService.join(joinCode);
          navigate(ROUTES.NAV.COMPETITION_DETAIL(joinCode), { replace: true });
        } catch (e) {
          handleApiError(e, undefined, ERRORS.COMPETITION.NOT_FOUND(joinCode));
          navigate(ROUTES.NAV.DASHBOARD, { replace: true });
        }
      } else {
        navigate(ROUTES.NAV.DASHBOARD, { replace: true });
      }
    } catch (e) {
      const apiError = e as ApiError;
      if (apiError.status === HTTP_STATUS.UNAUTHORIZED) {
        setError('root.serverError', {
          type: 'server',
          message: ERRORS.AUTH.INVALID_CREDENTIALS,
        });
      } else {
        handleApiError(e);
      }
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.toLowerCase().replace(/\s/g, '');
    setValue('username', cleanValue, { shouldValidate: false });
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    handleUsernameChange,
    setValue,
    errors,
    isSubmitting,
  };
};
