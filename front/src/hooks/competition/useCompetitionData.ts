import { useQuery, useQueryClient } from '@tanstack/react-query';
import { competitionService } from '@/services/api/competition';
import { QUERY_KEYS } from '@/constants';

export const useCompetitionData = (code: string) => {
  const queryClient = useQueryClient();

  const competitionQuery = useQuery({
    queryKey: QUERY_KEYS.competition.byCode(code),
    queryFn: () => competitionService.getByCode(code),
    enabled: !!code,
    staleTime: 1000 * 60 * 5,
  });

  const competitionId = competitionQuery.data?.id;

  const leaderboardQuery = useQuery({
    queryKey: QUERY_KEYS.competition.byId(competitionId).leaderboard,
    queryFn: () => competitionService.getLeaderboard(competitionId!),
    enabled: !!competitionId,
  });

  const actionsQuery = useQuery({
    queryKey: QUERY_KEYS.competition.byId(competitionId).actions,
    queryFn: () => competitionService.getActions(competitionId!),
    enabled: !!competitionId,
  });

  /**
   * Fonction de rafraîchissement global :
   * Invalide toutes les requêtes liées à cette compétition pour forcer un re-fetch.
   */
  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.competition.byCode(code),
    });

    if (competitionId) {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.competition.byId(competitionId).root,
      });
    }
  };

  const isInitialLoading =
    competitionQuery.isLoading ||
    (!!competitionId && (leaderboardQuery.isLoading || actionsQuery.isLoading));

  return {
    competition: competitionQuery.data,
    leaderboard: leaderboardQuery.data ?? [],
    actions: actionsQuery.data ?? [],
    isReady: !isInitialLoading && !!competitionQuery.data,
    isRefreshing: competitionQuery.isFetching || leaderboardQuery.isFetching,
    error:
      competitionQuery.error || leaderboardQuery.error || actionsQuery.error,
    refresh,
  };
};
