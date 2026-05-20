import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resetPasswordService } from '@/services';
import { ROUTES, AUTH_UI, ERRORS } from '@/constants';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/validations';

export const useResetPassword = (token: string | undefined) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
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

  const mutation = useMutation({
    mutationFn: (password: string) =>
      resetPasswordService.reset(token!, password),
    onSuccess: () => {
      toast.success(AUTH_UI.RESET_PASSWORD.SUCCESS);
      navigate(ROUTES.NAV.LOGIN);
    },
    onError: () => {
      toast.error(ERRORS.AUTH.RESET_PASSWORD_FAILED);
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
