import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AVAILABILITY, QUERY_KEYS, RULES, STALE_TIMES } from '@/shared';
import { userService } from '@/features/account/services';

export const useUsernameCheck = (
  username: string,
  currentPlayerId: string | null = null,
  initialUsername: string = '',
) => {
  const [debouncedUsername, setDebouncedUsername] = useState('');

  const isTyping = username !== debouncedUsername;

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedUsername(username),
      RULES.SEARCH.DEBOUNCE_DELAY,
    );
    return () => clearTimeout(timer);
  }, [username]);

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEYS.auth.usernameCheck(debouncedUsername),
    queryFn: ({ signal }) =>
      userService.checkUsername(debouncedUsername, signal),
    enabled: debouncedUsername.length >= RULES.AUTH.MIN_USERNAME,
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
    ((isFetching && !currentPlayerId) ||
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
