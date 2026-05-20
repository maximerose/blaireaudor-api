import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/validations';
import { resetPasswordService } from '@/services';

export const useForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
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
