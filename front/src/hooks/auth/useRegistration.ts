import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { finalizeSlug, slugify } from '@/utils';
import { authService } from '@/services/api/auth';
import { useAuth, usePlayerSearch } from '@/hooks';

export const useRegistration = (redirectUrl: string) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameCustomized, setIsUsernameCustomized] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<
    'available' | 'taken' | 'guest_exists' | null
  >(null);
  const [foundGuest, setFoundGuest] = useState<{
    id: string;
    name: string;
    last_competition_name: string;
  } | null>(null);
  const [checkLoading, setCheckLoading] = useState(false);
  const [showUsernameHint, setShowUsernameHint] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { search, results, searching, setResults } = usePlayerSearch();

  const [formData, setFormData] = useState({
    display_name: '',
    username: '',
    plain_password: '',
    player_id: null as string | null,
  });

  const filteredResults = results.filter((p) => p.has_account === false);

  const handlePlayerSelect = (player: any) => {
    setIsUsernameCustomized(true);
    setFormData((prev) => ({
      ...prev,
      display_name: player.display_name,
      username: player.username,
      player_id: player.id,
    }));
  };

  const handleClearSearch = () => {
    setResults([]);
  };

  const handleClearPlayer = () => {
    setIsUsernameCustomized(false);
    setFormData((prev) => ({
      ...prev,
      player_id: null,
      display_name: '',
      username: '',
    }));
    setUsernameStatus(null);
    setResults([]);
  };

  useEffect(() => {
    const { username, player_id } = formData;

    if (!username || username.length < 3) {
      setUsernameStatus(null);
      setCheckLoading(false);
      return;
    }

    setCheckLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await authService.checkUsername(username);
        if (!data.available) {
          setUsernameStatus('taken');
        } else if (data.is_guest_profile) {
          if (player_id === data.guest_id) {
            setUsernameStatus('available');
          } else {
            setUsernameStatus('guest_exists');
            setFoundGuest({
              id: data.guest_id,
              name: data.guest_name,
              last_competition_name: data.player.last_competition_name,
            });
          }
        } else {
          setUsernameStatus('available');
        }
      } catch (e) {
        console.error('Erreur check username', e);
        setUsernameStatus('taken');
      } finally {
        setCheckLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const linkFoundGuest = () => {
    if (!foundGuest) return;
    setIsUsernameCustomized(true);
    setFormData((prev) => ({
      ...prev,
      player_id: foundGuest.id,
      display_name: foundGuest.name,
    }));
    setUsernameStatus('available');
    setFoundGuest(null);
    setShowUsernameHint(false);
  };

  const getSubmitButtonText = () => {
    if (isLoading) return 'Inscription en cours...';
    if (checkLoading) return 'Vérification du pseudo...';
    if (usernameStatus === 'taken') return 'Pseudo indisponible';
    if (usernameStatus === 'guest_exists') return 'Profil existant';
    return "S'inscrire au Blaireau d'Or";
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      display_name: val,
      username: isUsernameCustomized ? prev.username : slugify(val),
    }));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = slugify(e.target.value);
    setIsUsernameCustomized(true);
    setUsernameStatus(null);
    setFormData({ ...formData, username: newUsername });
  };

  const handleUsernameFocus = () => setShowUsernameHint(true);
  const handleUsernameBlur = () => {
    setShowUsernameHint(false);
    cleanUsername();
  };
  const handleDisplayNameBlur = () => {
    if (!isUsernameCustomized) {
      cleanUsername();
    }
  };

  const cleanUsername = () => {
    setFormData((prev) => ({
      ...prev,
      username: finalizeSlug(prev.username),
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, plain_password: e.target.value }));
  };

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
        setMessage(data.message || '❌ Une erreur est survenue.');
      }
    } catch (error) {
      setMessage('📡 Erreur de connexion au serveur.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayStates = {
    shouldShowUsernameCheck:
      formData.username.length >= 3 &&
      usernameStatus !== 'guest_exists' &&
      usernameStatus !== null,

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
      search,
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
