import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { competitionService } from '@/features/competition/services';
import { AVAILABILITY, RULES, STALE_TIMES } from '@/shared';

export const useJoinCodeCheck = (
  code: string | null,
  originalCode?: string | null,
) => {
  const [debouncedCode, setDebouncedCode] = useState(code || '');

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedCode(code || ''),
      RULES.SEARCH.DEBOUNCE_DELAY,
    );
    return () => clearTimeout(timer);
  }, [code]);

  const isOriginal = originalCode && debouncedCode === originalCode;

  const { data, isLoading } = useQuery({
    queryKey: ['competitions', 'check-code', debouncedCode],
    queryFn: ({ signal }) =>
      competitionService.checkJoinCode(debouncedCode, signal),
    enabled:
      debouncedCode.length >= RULES.COMPETITION.MIN_JOIN_CODE && !isOriginal,
    staleTime: STALE_TIMES.MUTATION_CHECK,
  });

  const status =
    !debouncedCode || debouncedCode.length < 3
      ? null
      : isOriginal
        ? AVAILABILITY.AVAILABLE
        : !data
          ? null
          : !data.available
            ? AVAILABILITY.TAKEN
            : AVAILABILITY.AVAILABLE;

  return { status, isLoading };
};
