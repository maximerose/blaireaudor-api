import { useAuthContext } from '@/features/account/context/AuthContext';
import { userService } from '@/features/account/services';
import {
  updatePasswordSchema,
  updatePreferencesSchema,
  updateProfileInfoSchema,
  type UpdatePasswordData,
  type UpdatePreferencesData,
  type UpdateProfileInfoData,
} from '@/features/account/validations';
import { AVAILABILITY, ERRORS, SUCCESS, handleApiError } from '@/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAccountValidation } from './useAccountValidation';

export const useProfile = () => {
  const { user, refreshUser } = useAuthContext();
  const [activeHint, setActiveHint] = useState<{
    title: string;
    description: string;
  } | null>(null);

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

  const prefsForm = useForm<UpdatePreferencesData>({
    resolver: zodResolver(updatePreferencesSchema),
    defaultValues: {
      // Par défaut, si la BDD renvoie vide, on part du principe que tout est "true" (actif)
      notification_preferences: user?.notification_preferences || {},
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

  const onPrefsSubmit = async (data: UpdatePreferencesData) => {
    try {
      await userService.updateProfile(data);
      await refreshUser();
      toast.success(SUCCESS.AUTH.INFO_UPDATED);
      prefsForm.reset(data);
    } catch (e) {
      handleApiError(e, undefined, ERRORS.AUTH.UPDATE_INFO_FAILED);
    }
  };

  return {
    stats: user?.stats || null,
    defaultUsername: infoForm.formState.defaultValues?.username || '',
    defaultEmail: infoForm.formState.defaultValues?.email || '',
    passwordValue: passwordForm.watch('new_password') || '',
    infoForm,
    passwordForm,
    prefsForm,
    onInfoSubmit: infoForm.handleSubmit(onInfoSubmit),
    onPasswordSubmit: passwordForm.handleSubmit(onPasswordSubmit),
    onPrefsSubmit: prefsForm.handleSubmit(onPrefsSubmit),
    activeHint,
    setActiveHint,
    ...validation,
  };
};
