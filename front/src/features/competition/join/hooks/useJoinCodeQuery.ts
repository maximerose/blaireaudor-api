import { useQuery } from '@tanstack/react-query';
import { competitionService } from '@/features/competition/services';
import { QUERY_KEYS, RULES, STALE_TIMES } from '@/shared';

export const useJoinCodeQuery = (code: string | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.competition.byCode(code || ''),
    queryFn: ({ signal }) => competitionService.getByCode(code!, signal),
    enabled: !!code && code.length >= RULES.COMPETITION.MIN_JOIN_CODE,
    staleTime: STALE_TIMES.LONG,
    retry: false,
  });
};
