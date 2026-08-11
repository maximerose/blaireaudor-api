import { competitionService } from '@/features/competition/services';
import { ERRORS, QUERY_KEYS, STALE_TIMES } from '@/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useCompetitionData = (code: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEYS.competition.byCode(code),
    queryFn: ({ signal }) => competitionService.getByCode(code, signal),
    enabled: !!code,
    staleTime: STALE_TIMES.MUTATION_CHECK,
    retry: false,
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.competition.byCode(code),
    });
  };

  return {
    competition: query.data?.competition,
    leaderboard: query.data?.leaderboard ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    isReady: query.isSuccess,
    isRefreshing: query.isFetching,
    error: query.isError ? ERRORS.COMPETITION.NOT_FOUND(code) : null,
    refresh,
  };
};
