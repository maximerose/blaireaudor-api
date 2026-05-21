import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AVAILABILITY, QUERY_KEYS, STALE_TIMES } from '@/shared';
import { userService } from '@/features/account/services';

export const useUsernameCheck = (
  username: string,
  currentPlayerId: string | null,
) => {
  const [debouncedUsername, setDebouncedUsername] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedUsername(username), 400);
    return () => clearTimeout(timer);
  }, [username]);

  const { data, isLoading: usernameLoading } = useQuery({
    queryKey: QUERY_KEYS.auth.usernameCheck(debouncedUsername),
    queryFn: ({ signal }) =>
      userService.checkUsername(debouncedUsername, signal),
    enabled: debouncedUsername.length >= 2,
    staleTime: STALE_TIMES.MUTATION_CHECK,
  });

  const usernameStatus = !data
    ? null
    : !data.available
      ? AVAILABILITY.TAKEN
      : data.is_guest_profile && currentPlayerId !== data.player?.id
        ? AVAILABILITY.GUEST_EXISTS
        : AVAILABILITY.AVAILABLE;

  return {
    usernameStatus,
    usernameLoading,
    debouncedUsername,
    foundGuest: data?.is_guest_profile && data.player ? data.player : null,
  };
};
