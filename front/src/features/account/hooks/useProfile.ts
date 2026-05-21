import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  AVAILABILITY,
  ERRORS,
  SUCCESS,
  camelToSnake,
  type ApiError,
} from '@/shared';
import { useAuthContext } from '@/features/account/context';
import {
  updatePasswordSchema,
  updateProfileInfoSchema,
  type UpdatePasswordData,
  type UpdateProfileInfoData,
} from '@/features/account/validations';
import { userService } from '@/features/account/services';
import { useAccountValidation } from './useAccountValidation';

export const useProfile = () => {
  const { user, refreshUser } = useAuthContext();

  const infoForm = useForm<UpdateProfileInfoData>({
    resolver: zodResolver(updateProfileInfoSchema),
    mode: 'onBlur',
    defaultValues: {
      display_name: user?.player?.display_name || '',
      username: user?.username || '',
      email: user?.email || '',
    },
  });

  const passwordForm = useForm<UpdatePasswordData>({
    resolver: zodResolver(updatePasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const validation = useAccountValidation<UpdateProfileInfoData>({
    currentUsername: infoForm.watch('username'),
    currentEmail: infoForm.watch('email'),
    setValue: infoForm.setValue,
    trigger: infoForm.trigger,
    currentPlayerId: user?.player?.id || null,
    originalUsername: user?.username,
    originalEmail: user?.email,
  });

  const onInfoSubmit = async (data: UpdateProfileInfoData) => {
    if (
      (validation.usernameStatus === AVAILABILITY.TAKEN &&
        !validation.isUsernameUnchanged) ||
      (validation.emailStatus === AVAILABILITY.TAKEN &&
        !validation.isEmailUnchanged)
    )
      return;

    try {
      await userService.updateProfile(data);
      await refreshUser();
      toast.success(SUCCESS.AUTH.INFO_UPDATED);
      infoForm.reset(data);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.violations) {
        apiError.violations.forEach((v) => {
          const formKey = camelToSnake(v.propertyPath);
          infoForm.setError(formKey as keyof UpdateProfileInfoData, {
            type: 'server',
            message: v.message,
          });
        });
      } else {
        toast.error(ERRORS.AUTH.UPDATE_INFO_FAILED);
      }
    }
  };

  const onPasswordSubmit = async (data: UpdatePasswordData) => {
    try {
      await userService.updateProfile(data);
      toast.success(SUCCESS.AUTH.PASSWORD_UPDATED);
      passwordForm.reset();
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.violations) {
        apiError.violations.forEach((v) => {
          const formKey = camelToSnake(v.propertyPath);
          passwordForm.setError(formKey as keyof UpdatePasswordData, {
            type: 'server',
            message: v.message,
          });
        });
      } else {
        toast.error(ERRORS.AUTH.UPDATE_PASSWORD_FAILED);
      }
    }
  };

  return {
    infoForm,
    passwordForm,
    onInfoSubmit: infoForm.handleSubmit(onInfoSubmit),
    onPasswordSubmit: passwordForm.handleSubmit(onPasswordSubmit),
    ...validation,
  };
};
