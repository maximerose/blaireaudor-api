import { useState } from 'react';
import { finalizeSlug, slugify } from '@/shared';
import type { PlayerCompact } from '@/features/player';

export const useRegistrationForm = () => {
  const [formData, setFormData] = useState({
    display_name: '',
    username: '',
    plain_password: '',
    player_id: null as string | null,
  });

  const [isUsernameCustomized, setIsUsernameCustomized] = useState(false);
  const [showUsernameHint, setShowUsernameHint] = useState(false);

  // --- HANDLERS DE SAISIE ---
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
    setFormData((prev) => ({ ...prev, username: slugify(e.target.value) }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, plain_password: e.target.value }));
  };

  // --- NETTOYAGE (SLUG) ---
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

  // --- LIAISON PROFIL (Guest / Recherche) ---
  const linkPlayer = (player: PlayerCompact) => {
    setIsUsernameCustomized(true);
    setShowUsernameHint(false);
    setFormData((prev) => ({
      ...prev,
      display_name: player.display_name || prev.display_name,
      username: player.username || prev.username,
      player_id: player.id || null,
    }));
  };

  const unlinkPlayer = () => {
    setIsUsernameCustomized(false);
    setFormData((prev) => ({
      ...prev,
      display_name: '',
      username: '',
      player_id: null,
    }));
  };

  return {
    formData,
    showUsernameHint,
    handleDisplayNameChange,
    handleUsernameChange,
    handlePasswordChange,
    handleUsernameFocus,
    handleUsernameBlur,
    handleDisplayNameBlur,
    linkPlayer,
    unlinkPlayer,
  };
};
