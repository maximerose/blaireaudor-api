import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { finalizeSlug, slugify } from '../utils/stringUtils';
import { authService } from '../api/authService';
import { useAuth } from './useAuth';
import { usePlayerSearch } from './usePlayerSearch';

export const useRegistration = (redirectUrl: string) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameCustomized, setIsUsernameCustomized] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null,
  );
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
    setUsernameAvailable(null);
    setResults([]);
  };

  useEffect(() => {
    const { username } = formData;

    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      setCheckLoading(false);
      return;
    }

    setCheckLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await authService.checkUsername(username);
        setUsernameAvailable(data.available);
      } catch (e) {
        console.error('Erreur check username', e);
        setUsernameAvailable(false);
      } finally {
        setCheckLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const getSubmitButtonText = () => {
    if (isLoading) return 'Inscription en cours...';
    if (checkLoading) return 'Vérification du pseudo...';
    if (usernameAvailable === false) return 'Pseudo indisponible';
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
    setUsernameAvailable(null);
    setFormData({ ...formData, username: newUsername });
  };

  const handleUsernameFocus = () => setShowUsernameHint(true);
  const handleUsernameBlur = () => {
    setShowUsernameHint(false);
    if (!formData.player_id) cleanUsername();
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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || checkLoading || usernameAvailable === false) return;

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

  return {
    formData,
    message,
    isLoading,
    usernameAvailable,
    checkLoading,
    showUsernameHint,
    submitButtonText: getSubmitButtonText(),
    isSubmitDisabled:
      isLoading ||
      checkLoading ||
      usernameAvailable === false ||
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
    handlePasswordChange,
    handleSubmit,
  };
};
