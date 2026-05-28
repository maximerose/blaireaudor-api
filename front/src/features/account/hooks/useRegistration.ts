import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  slugify,
  finalizeSlug,
  type ApiError,
  AVAILABILITY,
  FORM,
  ERRORS,
  ROUTES,
  handleApiError,
} from '@/shared';
import { type Player, type PlayerCompact } from '@/features/player';
import { useAuthContext } from '@/features/account/context/AuthContext';
import {
  registerSchema,
  type RegisterFormData,
} from '@/features/account/validations';
import type { AuthResponseData } from '@/features/account/types';
import { authService } from '@/features/account/services';
import { AUTH_UI } from '@/features/account/constants';
import { useAccountValidation } from './useAccountValidation';
import { useJoinCodeQuery } from '@/features/competition/join';
import { usePlayerSearch } from '@/features/player/hooks/usePlayerSearch';

export const useRegistration = (redirectUrl: string) => {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const joinCode = searchParams.get('code');
  const { data: compData, isLoading: isCompLoading } =
    useJoinCodeQuery(joinCode);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      display_name: '',
      username: '',
      email: '',
      plain_password: '',
      confirm_password: '',
      player_id: null,
    },
  });

  const [isUsernameCustomized, setIsUsernameCustomized] = useState(false);
  const [showUsernameHint, setShowUsernameHint] = useState(false);

  const currentUsername = watch('username');
  const currentEmail = watch('email');
  const currentPlayerId = watch('player_id');
  const currentDisplayName = watch('display_name');

  const localCompetitionGuests = useMemo(() => {
    if (!compData?.leaderboard) return [];
    return compData.leaderboard
      .filter((p) => !p.player.has_account)
      .map((p) => p.player);
  }, [compData?.leaderboard]);

  const validation = useAccountValidation<RegisterFormData>({
    currentUsername,
    currentEmail,
    setValue,
    trigger,
    currentPlayerId,
    onUsernameChange: () => setIsUsernameCustomized(true),
    onUsernameBlur: () => setShowUsernameHint(false),
  });

  const {
    searchTerm,
    setSearchTerm,
    results: rawSearchResults,
    searching,
    clearSearch,
  } = usePlayerSearch();

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
    setValue('display_name', val, { shouldValidate: false });
    if (!isUsernameCustomized) {
      setValue('username', slugify(val), { shouldValidate: false });
    }
  };

  const handleDisplayNameBlur = () => {
    if (!isUsernameCustomized) {
      setValue('username', finalizeSlug(watch('username')), {
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
      const result = await authService.register({
        username: data.username,
        plain_password: data.plain_password,
        display_name: data.display_name,
        email: data.email,
        player_id: data.player_id,
        join_code: joinCode,
      });
      return result.data;
    },
    onSuccess: async (_data, variables) => {
      await login({
        username: variables.username,
        password: variables.plain_password,
      });
      if (joinCode) {
        navigate(ROUTES.NAV.COMPETITION_DETAIL(joinCode));
      } else {
        navigate(redirectUrl);
      }
    },
    onError: (e) =>
      handleApiError(e, setError, ERRORS.AUTH.REGISTRATION_FAILED),
  });

  const onSubmit = (data: RegisterFormData) => {
    if (
      validation.usernameLoading ||
      validation.emailLoading ||
      validation.usernameStatus === AVAILABILITY.TAKEN ||
      validation.emailStatus === AVAILABILITY.TAKEN
    )
      return;
    registerMutation.mutate(data);
  };

  const getSubmitButtonText = () => {
    if (registerMutation.isPending) return AUTH_UI.REGISTER.LOADING_SUBMIT;
    if (validation.usernameLoading) return FORM.AUTH.HINTS.USERNAME_CHECK;
    if (validation.emailLoading) return FORM.AUTH.HINTS.EMAIL_CHECK;
    if (validation.usernameStatus === AVAILABILITY.TAKEN)
      return FORM.AUTH.HINTS.USERNAME_TAKEN;
    if (validation.usernameStatus === AVAILABILITY.GUEST_EXISTS)
      return AUTH_UI.GUEST_ALERT.TITLE;
    return AUTH_UI.REGISTER.SUBMIT;
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    watch,
    handleDisplayNameChange,
    handleDisplayNameBlur,
    handleUsernameFocus: () => setShowUsernameHint(true),
    isLoading: registerMutation.isPending,
    isSubmitting,
    displayStates: {
      shouldShowUsernameCheck:
        currentUsername.length >= 3 &&
        validation.usernameStatus !== AVAILABILITY.GUEST_EXISTS &&
        (validation.usernameLoading || validation.usernameStatus !== null),
      shouldShowEmailCheck:
        currentEmail.includes('@') && validation.emailStatus !== null,
      shouldShowGuestAlert:
        !validation.usernameLoading &&
        validation.usernameStatus === AVAILABILITY.GUEST_EXISTS &&
        !!validation.foundGuest,
      shouldShowUsernameHint: showUsernameHint,
    },
    submitButtonText: getSubmitButtonText(),
    isSubmitDisabled:
      registerMutation.isPending ||
      validation.usernameLoading ||
      validation.usernameStatus === AVAILABILITY.TAKEN ||
      validation.emailLoading ||
      validation.emailStatus === AVAILABILITY.TAKEN,

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
      localGuests: localCompetitionGuests,
      isCompLoading,
      hasJoinCode: !!joinCode,
    },
    linkFoundGuest: () =>
      validation.foundGuest && linkPlayer(validation.foundGuest),
    ...validation,
  };
};
