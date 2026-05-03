import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/api/auth';
import type { PlayerPreview } from '@/types';

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
    queryKey: ['username-check', debouncedTerm],
    queryFn: () => authService.checkUsername(debouncedTerm),
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
        ? (data.player as PlayerPreview)
        : null,
  };
};
