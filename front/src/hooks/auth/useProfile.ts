import { useAuthContext } from '@/context';
import {
  type UpdatePasswordData,
  updatePasswordSchema,
  type UpdateProfileInfoData,
  updateProfileInfoSchema,
} from '@/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useUsernameCheck } from './useUsernameCheck';
import { useEmailCheck } from './useEmailCheck';
import { userService } from '@/services';
import toast from 'react-hot-toast';
import {
  AVAILABILITY,
  ERRORS,
  SUCCESS,
  camelToSnake,
  finalizeSlug,
  slugify,
  type ApiError,
} from '@/shared';

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
    mode: 'onChange',
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const currentUsername = infoForm.watch('username');
  const currentEmail = infoForm.watch('email');

  const { status: rawUsernameStatus, isLoading: usernameLoading } =
    useUsernameCheck(currentUsername, user?.player?.id || null);
  const { status: rawEmailStatus, isLoading: emailLoading } =
    useEmailCheck(currentEmail);

  const isUsernameUnchanged = currentUsername === user?.username;
  const isEmailUnchanged = currentEmail === user?.email;

  const usernameStatus = isUsernameUnchanged
    ? AVAILABILITY.AVAILABLE
    : rawUsernameStatus;
  const emailStatus = isEmailUnchanged
    ? AVAILABILITY.AVAILABLE
    : rawEmailStatus;

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    infoForm.setValue('username', slugify(e.target.value), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleUsernameBlur = () => {
    infoForm.setValue('username', finalizeSlug(currentUsername), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onInfoSubmit = async (data: UpdateProfileInfoData) => {
    if (
      (usernameStatus === AVAILABILITY.TAKEN && !isUsernameUnchanged) ||
      (emailStatus === AVAILABILITY.TAKEN && !isEmailUnchanged)
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
    handleUsernameChange,
    handleUsernameBlur,
    onInfoSubmit: infoForm.handleSubmit(onInfoSubmit),
    onPasswordSubmit: passwordForm.handleSubmit(onPasswordSubmit),
    status: {
      username: usernameStatus,
      email: emailStatus,
      isUsernameLoading: usernameLoading,
      isEmailLoading: emailLoading,
      isUsernameUnchanged,
      isEmailUnchanged,
    },
  };
};
