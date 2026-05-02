// front/src/hooks/auth/useUsernameCheck.ts
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/api/auth';

export const useUsernameCheck = (username: string, playerId: string | null) => {
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(username), 400);
    return () => clearTimeout(timer);
  }, [username]);

  const { data, isLoading } = useQuery({
    queryKey: ['username-check', debouncedTerm],
    queryFn: () => authService.checkUsername(debouncedTerm),
    enabled: debouncedTerm.length >= 3,
    staleTime: 1000 * 60 * 5,
  });

  const status = !data
    ? null
    : !data.available
      ? 'taken'
      : data.is_guest_profile && playerId !== data.guest_id
        ? 'guest_exists'
        : 'available';

  return {
    status,
    isLoading,
    foundGuest: data?.is_guest_profile
      ? {
          id: data.guest_id,
          name: data.guest_name,
          last_competition_name: data.player?.last_competition_name,
        }
      : null,
  };
};
