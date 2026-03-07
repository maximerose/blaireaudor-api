import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { finalizeSlug, slugify } from '../utils/stringUtils';
import { authService } from '../api/authService';
import { useAuth } from './useAuth';

export const useRegistration = (redirectUrl: string) => {
  const [formData, setFormData] = useState({
    display_name: '',
    username: '',
    plain_password: '',
  });
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

  useEffect(() => {
    const { username } = formData;
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckLoading(true);
      try {
        const data = await authService.checkUsername(username);
        setUsernameAvailable(data.available);
      } catch (e) {
        console.error('Erreur check username', e);
      } finally {
        setCheckLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const getSubmitButtonText = () => {
    if (isLoading) return 'Inscription en cours...';
    if (checkLoading) return 'Vérification du pseudo...';
    return "S'inscrire au Blaireau d'Or";
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUsernameAvailable(null);

    setFormData((prev) => ({
      ...prev,
      display_name: val,
      username: isUsernameCustomized ? prev.username : slugify(val),
    }));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUsernameCustomized(true);
    setUsernameAvailable(null);
    setFormData({ ...formData, username: slugify(e.target.value) });
  };

  const handleUsernameFocus = () => {
    setShowUsernameHint(true);
  };

  const handleUsernameBlur = () => {
    setShowUsernameHint(false);
    cleanUsername();
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

    if (isLoading) return;
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
      console.error("Erreur d'inscription :", error);
      setMessage('📡 Erreur de connexion au serveur.');
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
    setFormData,
    submitButtonText: getSubmitButtonText(),
    isSubmitDisabled: isLoading || checkLoading,
    handleDisplayNameChange,
    handleUsernameChange,
    handleUsernameFocus,
    handleUsernameBlur,
    handlePasswordChange,
    handleSubmit,
  };
};
