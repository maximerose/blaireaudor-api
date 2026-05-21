import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/features/account/validations';
import { resetPasswordService } from '@/features/account/services';

export const useForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
  });

  const mutation = useMutation({
    mutationFn: (email: string) => resetPasswordService.requestReset(email),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    mutation.mutate(data.email);
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSuccess: mutation.isSuccess || mutation.isError,
    isSubmitting: mutation.isPending,
  };
};
