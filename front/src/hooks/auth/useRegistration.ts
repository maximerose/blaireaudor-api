import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { finalizeSlug, slugify } from '@/utils';
import { authService } from '@/services/api/auth';
import { useAuth, usePlayerSearch, useUsernameCheck } from '@/hooks';
import type { Player } from '@/types';
import { AUTH_UI, FORM, ERRORS, ICONS } from '@/constants';

export const useRegistration = (redirectUrl: string) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    results: rawSearchResults,
    searching,
  } = usePlayerSearch();

  const [formData, setFormData] = useState({
    display_name: '',
    username: '',
    plain_password: '',
    player_id: null as string | null,
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameCustomized, setIsUsernameCustomized] = useState(false);
  const [showUsernameHint, setShowUsernameHint] = useState(false);

  const {
    status: usernameStatus,
    isLoading: checkLoading,
    foundGuest,
  } = useUsernameCheck(formData.username, formData.player_id);

  const filteredResults = rawSearchResults.filter(
    (p: Player) => p.has_account === false,
  );

  // LOGIQUE ACTIONS
  const handlePlayerSelect = (player: Player) => {
    setIsUsernameCustomized(true);
    setFormData((prev) => ({
      ...prev,
      display_name: player.display_name,
      username: player.username,
      player_id: player.id,
    }));
    setSearchTerm('');
  };

  const handleClearSearch = () => setSearchTerm('');

  const handleClearPlayer = () => {
    setIsUsernameCustomized(false);
    setFormData({
      display_name: '',
      username: '',
      plain_password: formData.plain_password,
      player_id: null,
    });
    setSearchTerm('');
  };

  const linkFoundGuest = () => {
    if (!foundGuest) return;
    setIsUsernameCustomized(true);
    setFormData((prev) => ({
      ...prev,
      player_id: foundGuest.id,
      display_name: foundGuest.display_name,
    }));
    setShowUsernameHint(false);
  };

  // GESTION CHAMPS
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      display_name: val,
      username: isUsernameCustomized ? prev.username : slugify(val),
    }));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUsernameCustomized(true);
    setFormData({ ...formData, username: slugify(e.target.value) });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, plain_password: e.target.value }));
  };

  // NETTOYAGE SLUG
  const cleanUsername = () => {
    setFormData((prev) => ({ ...prev, username: finalizeSlug(prev.username) }));
  };

  const handleUsernameFocus = () => setShowUsernameHint(true);
  const handleUsernameBlur = () => {
    setShowUsernameHint(false);
    cleanUsername();
  };
  const handleDisplayNameBlur = () => {
    if (!isUsernameCustomized) cleanUsername();
  };

  // TEXTE DYNAMIQUE DU BOUTON (Centralisé)
  const getSubmitButtonText = () => {
    if (isLoading) return AUTH_UI.REGISTER.LOADING_SUBMIT;
    if (checkLoading) return FORM.AUTH.HINTS.USERNAME_CHECK;
    if (usernameStatus === 'taken') return FORM.AUTH.HINTS.USERNAME_TAKEN;
    if (usernameStatus === 'guest_exists') return AUTH_UI.GUEST_ALERT.TITLE;
    return AUTH_UI.REGISTER.SUBMIT;
  };

  // SOUMISSION
  const handleSubmit = async () => {
    if (isLoading || checkLoading || usernameStatus === 'taken') return;
    setIsLoading(true);
    setMessage('');

    try {
      const { ok, data } = await authService.register(formData);
      if (ok && data.token) {
        await login({
          username: formData.username,
          password: formData.plain_password,
        });
        navigate(redirectUrl);
      } else {
        setMessage(
          data.message || `${ICONS.FAILURE} ${ERRORS.AUTH.REGISTRATION_FAILED}`,
        );
      }
    } catch (error) {
      setMessage(`${ICONS.DANGER} ${ERRORS.NETWORK.SERVER}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ÉTATS D'AFFICHAGE (Correction Bug "Vérification en cours")
  const displayStates = {
    shouldShowUsernameCheck:
      formData.username.length >= 3 &&
      usernameStatus !== 'guest_exists' &&
      (checkLoading || usernameStatus !== null),
    shouldShowGuestAlert:
      !checkLoading && usernameStatus === 'guest_exists' && !!foundGuest,
    shouldShowUsernameHint: showUsernameHint,
  };

  return {
    formData,
    message,
    isLoading,
    usernameStatus,
    checkLoading,
    showUsernameHint,
    displayStates,
    submitButtonText: getSubmitButtonText(),
    isSubmitDisabled:
      isLoading ||
      checkLoading ||
      usernameStatus === 'taken' ||
      formData.username.length < 3,
    playerSearch: {
      searchTerm,
      setSearchTerm,
      results: filteredResults,
      searching,
      onSelect: handlePlayerSelect,
      onCloseSearch: handleClearSearch,
      onClear: handleClearPlayer,
      isLinked: !!formData.player_id,
      hasResults: filteredResults.length > 0,
    },
    handleDisplayNameChange,
    handleUsernameChange,
    handleUsernameFocus,
    handleUsernameBlur,
    handleDisplayNameBlur,
    handlePasswordChange,
    handleSubmit,
    foundGuest,
    linkFoundGuest,
  };
};
