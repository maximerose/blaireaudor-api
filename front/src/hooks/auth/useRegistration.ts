import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/api/authService';
import { useAuth, usePlayerSearch, useUsernameCheck } from '@/hooks';
import { useRegistrationForm } from './useRegistrationForm'; // <-- Notre nouveau hook
import type { Player } from '@/types';
import { AUTH_UI, FORM, ERRORS, ICONS, LOG_MESSAGES } from '@/constants';
import { useMutation } from '@tanstack/react-query';

export const useRegistration = (redirectUrl: string) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formManager = useRegistrationForm();
  const { formData, linkPlayer, unlinkPlayer } = formManager;

  const {
    searchTerm,
    setSearchTerm,
    results: rawSearchResults,
    searching,
    clearSearch,
  } = usePlayerSearch();
  const {
    status: usernameStatus,
    isLoading: checkLoading,
    foundGuest,
  } = useUsernameCheck(formData.username, formData.player_id);

  const [message, setMessage] = useState('');

  // --- ACTIONS INTERMÉDIAIRES ---
  const filteredResults = rawSearchResults.filter(
    (p: Player) => p.has_account === false,
  );

  const handlePlayerSelect = (player: Player) => {
    linkPlayer(player);
    setSearchTerm('');
  };

  const handleClearPlayer = () => {
    unlinkPlayer();
    setSearchTerm('');
  };

  const handleLinkFoundGuest = () => {
    if (foundGuest) linkPlayer(foundGuest);
  };

  // --- LOGIQUE UI ---
  const getSubmitButtonText = () => {
    if (registerMutation.isPending) return AUTH_UI.REGISTER.LOADING_SUBMIT;
    if (checkLoading) return FORM.AUTH.HINTS.USERNAME_CHECK;
    if (usernameStatus === 'taken') return FORM.AUTH.HINTS.USERNAME_TAKEN;
    if (usernameStatus === 'guest_exists') return AUTH_UI.GUEST_ALERT.TITLE;
    return AUTH_UI.REGISTER.SUBMIT;
  };

  const displayStates = {
    shouldShowUsernameCheck:
      formData.username.length >= 3 &&
      usernameStatus !== 'guest_exists' &&
      (checkLoading || usernameStatus !== null),
    shouldShowGuestAlert:
      !checkLoading && usernameStatus === 'guest_exists' && !!foundGuest,
    shouldShowUsernameHint: formManager.showUsernameHint,
  };

  // --- SOUMISSION API ---
  const registerMutation = useMutation({
    mutationFn: async () => {
      const { ok, data } = await authService.register(formData);

      if (!ok || !data.token) {
        throw new Error(
          data.message || `${ICONS.FAILURE} ${ERRORS.AUTH.REGISTRATION_FAILED}`,
        );
      }

      return data;
    },
    onSuccess: async () => {
      await login({
        username: formData.username,
        password: formData.plain_password,
      });

      navigate(redirectUrl);
    },
    onError: (error) => {
      console.error(LOG_MESSAGES.AUTH.REGISTRATION_FAILED, error);
    },
  });

  const handleSubmit = () => {
    if (
      registerMutation.isPending ||
      checkLoading ||
      usernameStatus === 'taken'
    )
      return;

    setMessage('');
    registerMutation.mutate();
  };

  return {
    ...formManager,
    message,
    isLoading: registerMutation.isPending,
    usernameStatus,
    checkLoading,
    displayStates,
    submitButtonText: getSubmitButtonText(),
    isSubmitDisabled:
      registerMutation.isPending ||
      checkLoading ||
      usernameStatus === 'taken' ||
      formData.username.length < 3,
    playerSearch: {
      searchTerm,
      setSearchTerm,
      results: filteredResults,
      searching,
      clearSearch,
      onSelect: handlePlayerSelect,
      onCloseSearch: () => setSearchTerm(''),
      onClear: handleClearPlayer,
      isLinked: !!formData.player_id,
      hasResults: filteredResults.length > 0,
    },
    handleSubmit,
    foundGuest,
    linkFoundGuest: handleLinkFoundGuest,
  };
};
