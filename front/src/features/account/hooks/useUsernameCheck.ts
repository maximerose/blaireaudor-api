import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AVAILABILITY, QUERY_KEYS, STALE_TIMES } from '@/shared';
import { userService } from '@/features/account/services';

export const useUsernameCheck = (
  username: string,
  currentPlayerId: string | null = null,
  initialUsername: string = '',
) => {
  const [debouncedUsername, setDebouncedUsername] = useState('');

  const isTyping = username !== debouncedUsername;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedUsername(username), 400);
    return () => clearTimeout(timer);
  }, [username]);

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEYS.auth.usernameCheck(debouncedUsername),
    queryFn: ({ signal }) =>
      userService.checkUsername(debouncedUsername, signal),
    enabled: debouncedUsername.length >= 2,
    staleTime: STALE_TIMES.MUTATION_CHECK,
  });

  const usernameStatus =
    isTyping || !data
      ? null
      : !data.available
        ? AVAILABILITY.TAKEN
        : data.is_guest_profile
          ? currentPlayerId === data.player?.id
            ? AVAILABILITY.LINKED
            : AVAILABILITY.GUEST_EXISTS
          : AVAILABILITY.AVAILABLE;

  const isUsernameChanged = Boolean(username && username !== initialUsername);

  const shouldShowFeedback = Boolean(
    isUsernameChanged &&
    !isTyping &&
    // 1. On affiche le "chargement" UNIQUEMENT s'il n'y a pas de joueur lié
    ((isFetching && !currentPlayerId) ||
      // 2. Une fois chargé, on affiche le résultat final SAUF si c'est un profil lié (LINKED)
      (!isFetching &&
        usernameStatus !== null &&
        usernameStatus !== AVAILABILITY.LINKED)),
  );

  return {
    usernameStatus,
    usernameLoading: isFetching,
    debouncedUsername,
    foundGuest: data?.is_guest_profile && data.player ? data.player : null,
    isUsernameChanged,
    shouldShowFeedback,
  };
};
