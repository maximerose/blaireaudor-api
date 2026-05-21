import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { PlayerCompact } from '@/features/player';
import { AVAILABILITY, QUERY_KEYS } from '@/shared';
import { userService } from '@/features/account';

export const useUsernameCheck = (
  username: string,
  currentPlayerId: string | null,
) => {
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(username), 400);
    return () => clearTimeout(timer);
  }, [username]);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.auth.usernameCheck(debouncedTerm),
    queryFn: ({ signal }) => userService.checkUsername(debouncedTerm, signal),
    enabled: debouncedTerm.length >= 2,
    staleTime: 1000 * 60 * 5,
  });

  const status = !data
    ? null
    : !data.available
      ? AVAILABILITY.TAKEN
      : data.is_guest_profile && currentPlayerId !== data.player?.id
        ? AVAILABILITY.GUEST_EXISTS
        : AVAILABILITY.AVAILABLE;

  return {
    status,
    isLoading,
    foundGuest:
      data?.is_guest_profile && data.player
        ? (data.player as PlayerCompact)
        : null,
  };
};
