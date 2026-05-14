import { useQuery, useQueryClient } from '@tanstack/react-query';
import { competitionService } from '@/services';
import { ERRORS, QUERY_KEYS } from '@/constants';

export const useCompetitionData = (code: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEYS.competition.byCode(code),
    queryFn: ({ signal }) => competitionService.getByCode(code, signal),
    enabled: !!code,
    staleTime: 1000 * 60 * 5,
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
