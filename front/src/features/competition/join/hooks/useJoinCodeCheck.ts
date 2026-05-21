import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { competitionService } from '@/features/competition/services';
import { AVAILABILITY } from '@/shared';

export const useJoinCodeCheck = (
  code: string | null,
  originalCode?: string | null,
) => {
  const [debouncedCode, setDebouncedCode] = useState(code || '');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedCode(code || ''), 400);
    return () => clearTimeout(timer);
  }, [code]);

  const isOriginal = originalCode && debouncedCode === originalCode;

  const { data, isLoading } = useQuery({
    queryKey: ['competitions', 'check-code', debouncedCode],
    queryFn: ({ signal }) =>
      competitionService.checkJoinCode(debouncedCode, signal),
    enabled: debouncedCode.length >= 3 && !isOriginal,
    staleTime: 1000 * 60 * 5,
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
