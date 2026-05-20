import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services';
import { AVAILABILITY, QUERY_KEYS } from '@/constants';

export const useEmailCheck = (email: string) => {
  const [debouncedEmail, setDebouncedEmail] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedEmail(email), 400);
    return () => clearTimeout(timer);
  }, [email]);

  const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(debouncedEmail);

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEYS.auth.emailCheck(debouncedEmail),
    queryFn: ({ signal }) => userService.checkEmail(debouncedEmail, signal),
    enabled: isValidFormat,
    staleTime: 1000 * 60 * 2,
  });

  const status = !data
    ? null
    : !data.available
      ? AVAILABILITY.TAKEN
      : AVAILABILITY.AVAILABLE;

  return { status, isLoading: isFetching };
};
