import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services';
import { useEmailCheck, usePlayerSearch, useUsernameCheck } from '@/hooks';
import type {
  Player,
  AuthResponseData,
  ApiError,
  PlayerCompact,
} from '@/types';
import { AUTH_UI, FORM, ERRORS, ICONS, LOG_MESSAGES } from '@/constants';
import { useMutation } from '@tanstack/react-query';
import { useAuthContext } from '@/context';
import { useForm } from 'react-hook-form';
import {
  type RegisterFormData,
  registerSchema,
} from '@/validations/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { slugify, finalizeSlug } from '@/utils';

export const useRegistration = (redirectUrl: string) => {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [globalMessage, setGlobalMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      display_name: '',
      username: '',
      email: '',
      plain_password: '',
      confirm_password: '',
      player_id: null,
    },
  });

  const currentUsername = watch('username');
  const currentEmail = watch('email');
  const currentPlayerId = watch('player_id');
  const currentDisplayName = watch('display_name');

  const [isUsernameCustomized, setIsUsernameCustomized] = useState(false);
  const [showUsernameHint, setShowUsernameHint] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    results: rawSearchResults,
    searching,
    clearSearch,
  } = usePlayerSearch();

  const {
    status: usernameStatus,
    isLoading: usernameCheckLoading,
    foundGuest,
  } = useUsernameCheck(currentUsername, currentPlayerId ?? null);

  const { status: emailStatus, isLoading: emailCheckLoading } =
    useEmailCheck(currentEmail);

  const filteredResults = rawSearchResults.filter(
    (p: Player) => p.has_account === false,
  );

  const linkPlayer = (player: PlayerCompact) => {
    setIsUsernameCustomized(true);
    setShowUsernameHint(false);
    setValue('display_name', player.display_name || currentDisplayName, {
      shouldValidate: true,
    });
    setValue('username', player.username || currentUsername, {
      shouldValidate: true,
    });
    setValue('player_id', player.id || null);
    setSearchTerm('');
  };

  const unlinkPlayer = () => {
    setIsUsernameCustomized(false);
    setValue('display_name', '');
    setValue('player_id', null);
    setSearchTerm('');
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('display_name', val, { shouldValidate: true });

    if (!isUsernameCustomized) {
      setValue('username', slugify(val), { shouldValidate: true });
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUsernameCustomized(true);
    setValue('username', slugify(e.target.value), { shouldValidate: true });
  };

  const handleUsernameBlur = () => {
    setShowUsernameHint(false);
    setValue('username', finalizeSlug(currentUsername), {
      shouldValidate: true,
    });
  };

  const handleDisplayNameBlur = () => {
    if (!isUsernameCustomized) {
      setValue('username', finalizeSlug(currentUsername), {
        shouldValidate: true,
      });
    }
  };

  const registerMutation = useMutation<
    AuthResponseData,
    ApiError,
    RegisterFormData
  >({
    mutationFn: async (data: RegisterFormData) => {
      const response = await authService.register(data);

      if (!response.ok) {
        throw response.data;
      }

      return response.data;
    },
    onSuccess: async (_data, variables) => {
      await login({
        username: variables.username,
        password: variables.plain_password,
      });

      navigate(redirectUrl);
    },
    onError: (errorData) => {
      console.error(LOG_MESSAGES.AUTH.REGISTRATION_FAILED, errorData);

      if (errorData.errors) {
        if (errorData.errors.username) {
          setError('username', {
            type: 'server',
            message: ERRORS.AUTH.USERNAME_TAKEN,
          });
        }
        if (errorData.errors.email) {
          setError('email', {
            type: 'server',
            message: ERRORS.AUTH.EMAIL_TAKEN,
          });
        }
      } else {
        setGlobalMessage(
          errorData.message ||
            `${ICONS.FAILURE} ${ERRORS.AUTH.REGISTRATION_FAILED}`,
        );
      }
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    if (
      usernameCheckLoading ||
      emailCheckLoading ||
      usernameStatus === 'taken' ||
      emailStatus === 'taken'
    )
      return;
    setGlobalMessage('');
    registerMutation.mutate(data);
  };

  const getSubmitButtonText = () => {
    if (registerMutation.isPending) return AUTH_UI.REGISTER.LOADING_SUBMIT;
    if (usernameCheckLoading) return FORM.AUTH.HINTS.USERNAME_CHECK;
    if (emailCheckLoading) return FORM.AUTH.HINTS.EMAIL_CHECK;
    if (usernameStatus === 'taken') return FORM.AUTH.HINTS.USERNAME_TAKEN;
    if (usernameStatus === 'guest_exists') return AUTH_UI.GUEST_ALERT.TITLE;
    return AUTH_UI.REGISTER.SUBMIT;
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    watch,
    handleDisplayNameChange,
    handleUsernameChange,
    handleUsernameFocus: () => setShowUsernameHint(true),
    handleUsernameBlur,
    handleDisplayNameBlur,

    globalMessage,
    isLoading: registerMutation.isPending,
    isSubmitting,
    usernameStatus,
    usernameCheckLoading,
    displayStates: {
      shouldShowUsernameCheck:
        currentUsername.length >= 3 &&
        usernameStatus !== 'guest_exists' &&
        (usernameCheckLoading || usernameStatus !== null),
      shouldShowEmailCheck: currentEmail.includes('@') && emailStatus !== null,
      shouldShowGuestAlert:
        !usernameCheckLoading &&
        usernameStatus === 'guest_exists' &&
        !!foundGuest,
      shouldShowUsernameHint: showUsernameHint,
    },
    emailStatus,
    emailCheckLoading,
    submitButtonText: getSubmitButtonText(),
    isSubmitDisabled:
      registerMutation.isPending ||
      usernameCheckLoading ||
      usernameStatus === 'taken' ||
      emailCheckLoading ||
      emailStatus === 'taken',

    playerSearch: {
      searchTerm,
      setSearchTerm,
      results: filteredResults,
      searching,
      clearSearch,
      onSelect: linkPlayer,
      onCloseSearch: () => setSearchTerm(''),
      onClear: unlinkPlayer,
      isLinked: !!currentPlayerId,
      hasResults: filteredResults.length > 0,
    },
    foundGuest,
    linkFoundGuest: () => foundGuest && linkPlayer(foundGuest),
  };
};
