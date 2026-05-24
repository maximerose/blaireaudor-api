import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AVAILABILITY, ERRORS, SUCCESS } from '@/shared';
import { useAuthContext } from '@/features/account/context';
import {
  updatePasswordSchema,
  updateProfileInfoSchema,
  type UpdatePasswordData,
  type UpdateProfileInfoData,
} from '@/features/account/validations';
import { userService } from '@/features/account/services';
import { useAccountValidation } from './useAccountValidation';
import { handleApiError } from '@/shared/utils/errorHandler';

export const useProfile = () => {
  const { user, refreshUser } = useAuthContext();

  const infoForm = useForm<UpdateProfileInfoData>({
    resolver: zodResolver(updateProfileInfoSchema),
    mode: 'onChange',
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
    } catch (e) {
      handleApiError(e, infoForm.setError, ERRORS.AUTH.UPDATE_INFO_FAILED);
    }
  };

  const onPasswordSubmit = async (data: UpdatePasswordData) => {
    try {
      await userService.updateProfile(data);
      toast.success(SUCCESS.AUTH.PASSWORD_UPDATED);
      passwordForm.reset();
    } catch (e) {
      handleApiError(
        e,
        passwordForm.setError,
        ERRORS.AUTH.UPDATE_PASSWORD_FAILED,
      );
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
