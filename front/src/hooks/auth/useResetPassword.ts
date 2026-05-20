import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resetPasswordService } from '@/services';
import { ROUTES, ERRORS, type ApiError, camelToSnake } from '@/shared';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/validations';
import { AUTH_UI } from '@/constants';

export const useResetPassword = (token: string | undefined) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { isLoading: isValidating, isError: tokenError } = useQuery({
    queryKey: ['reset-token', token],
    queryFn: () => {
      if (!token) throw new Error('Token manquant');
      return resetPasswordService.validateToken(token);
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation<{ message: string }, ApiError, string>({
    mutationFn: (password: string) =>
      resetPasswordService.reset(token!, password),
    onSuccess: () => {
      toast.success(AUTH_UI.RESET_PASSWORD.SUCCESS);
      navigate(ROUTES.NAV.LOGIN);
    },
    onError: (apiError: ApiError) => {
      if (apiError.violations?.length) {
        apiError.violations.forEach((v) => {
          const formKey = camelToSnake(v.propertyPath);
          setError(formKey as keyof ResetPasswordFormData, {
            type: 'server',
            message: v.message,
          });
        });
      } else {
        toast.error(apiError.message || ERRORS.AUTH.RESET_PASSWORD_FAILED);
      }
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    mutation.mutate(data.plain_password);
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    watch,
    errors,
    isValidating,
    tokenError,
    isSubmitting: mutation.isPending,
  };
};
