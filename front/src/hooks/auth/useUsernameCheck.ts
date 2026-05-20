import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services';
import type { PlayerCompact } from '@/types';
import { QUERY_KEYS } from '@/constants';

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
      ? 'taken'
      : data.is_guest_profile && currentPlayerId !== data.player?.id
        ? 'guest_exists'
        : 'available';

  return {
    status,
    isLoading,
    foundGuest:
      data?.is_guest_profile && data.player
        ? (data.player as PlayerCompact)
        : null,
  };
};
