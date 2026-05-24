import type React from 'react';
import type {
  UseFormSetValue,
  UseFormTrigger,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form';
import { useUsernameCheck } from './useUsernameCheck';
import { useEmailCheck } from './useEmailCheck';
import { AVAILABILITY, slugify, finalizeSlug } from '@/shared';

interface AccountValidationProps<T extends FieldValues> {
  currentUsername: string;
  currentEmail: string;
  setValue: UseFormSetValue<T>;
  trigger: UseFormTrigger<T>;
  currentPlayerId?: string | null;
  originalUsername?: string;
  originalEmail?: string;
  onUsernameChange?: () => void;
  onUsernameBlur?: () => void;
}

export const useAccountValidation = <T extends FieldValues>({
  currentUsername,
  currentEmail,
  setValue,
  trigger,
  currentPlayerId = null,
  originalUsername,
  originalEmail,
  onUsernameChange,
  onUsernameBlur,
}: AccountValidationProps<T>) => {
  const {
    usernameStatus: rawUsernameStatus,
    usernameLoading,
    debouncedUsername,
    foundGuest,
  } = useUsernameCheck(currentUsername, currentPlayerId);

  const {
    emailStatus: rawEmailStatus,
    emailLoading,
    debouncedEmail,
  } = useEmailCheck(currentEmail);

  const isUsernameTyping = currentUsername !== debouncedUsername;
  const isEmailTyping = currentEmail !== debouncedEmail;

  const isUsernameUnchanged = originalUsername
    ? currentUsername === originalUsername
    : false;
  const isEmailUnchanged = originalEmail
    ? currentEmail === originalEmail
    : false;

  const usernameStatus = isUsernameUnchanged
    ? AVAILABILITY.AVAILABLE
    : isUsernameTyping
      ? null
      : rawUsernameStatus;

  const emailStatus = isEmailUnchanged
    ? AVAILABILITY.AVAILABLE
    : isEmailTyping
      ? null
      : rawEmailStatus;

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(
      'username' as Path<T>,
      slugify(e.target.value) as PathValue<T, Path<T>>,
      { shouldDirty: true },
    );
    onUsernameChange?.();
  };

  const handleUsernameBlur = () => {
    setValue(
      'username' as Path<T>,
      finalizeSlug(currentUsername) as PathValue<T, Path<T>>,
      { shouldValidate: true, shouldDirty: true },
    );
    onUsernameBlur?.();
  };

  const handleEmailBlur = () => {
    trigger('email' as Path<T>);
  };

  const usernameRegistryOptions = {
    onChange: handleUsernameChange,
    onBlur: handleUsernameBlur,
  };

  return {
    usernameStatus,
    emailStatus,
    usernameLoading,
    emailLoading,
    isUsernameUnchanged,
    isEmailUnchanged,
    foundGuest,
    handleUsernameChange,
    handleUsernameBlur,
    handleEmailBlur,
    usernameRegistryOptions,
  };
};
