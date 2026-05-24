import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AVAILABILITY, QUERY_KEYS, RULES, STALE_TIMES } from '@/shared';
import { userService } from '@/features/account/services';

export const useEmailCheck = (email: string) => {
  const [debouncedEmail, setDebouncedEmail] = useState('');

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedEmail(email),
      RULES.SEARCH.DEBOUNCE_DELAY,
    );
    return () => clearTimeout(timer);
  }, [email]);

  const isValidFormat = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(debouncedEmail);

  const { data, isFetching: emailLoading } = useQuery({
    queryKey: QUERY_KEYS.auth.emailCheck(debouncedEmail),
    queryFn: ({ signal }) => userService.checkEmail(debouncedEmail, signal),
    enabled: isValidFormat,
    staleTime: STALE_TIMES.MUTATION_CHECK,
  });

  const emailStatus = !data
    ? null
    : !data.available
      ? AVAILABILITY.TAKEN
      : AVAILABILITY.AVAILABLE;

  return {
    emailStatus,
    emailLoading,
    debouncedEmail,
  };
};
