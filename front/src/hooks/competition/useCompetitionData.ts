import { useQuery, useQueryClient } from '@tanstack/react-query';
import { competitionService } from '@/services/api/competitionService';
import { ERRORS, QUERY_KEYS } from '@/constants';

export const useCompetitionData = (code: string) => {
  const queryClient = useQueryClient();

  const competitionQuery = useQuery({
    queryKey: QUERY_KEYS.competition.byCode(code),
    queryFn: ({ signal }) => competitionService.getByCode(code, signal),
    enabled: !!code,
    staleTime: 1000 * 60 * 5,
  });

  const competitionId = competitionQuery.data?.id;

  const leaderboardQuery = useQuery({
    queryKey: QUERY_KEYS.competition.byId(competitionId).leaderboard,
    queryFn: ({ signal }) =>
      competitionService.getLeaderboard(competitionId!, signal),
    enabled: !!competitionId,
  });

  const actionsQuery = useQuery({
    queryKey: QUERY_KEYS.competition.byId(competitionId).actions,
    queryFn: ({ signal }) =>
      competitionService.getActions(competitionId!, signal),
    enabled: !!competitionId,
  });

  /**
   * Fonction de rafraîchissement global :
   * Invalide toutes les requêtes liées à cette compétition pour forcer un re-fetch.
   */
  const refresh = async () => {
    await queryClient.invalidateQueries({
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

  const getErrorMessage = () => {
    if (competitionQuery.isError) return ERRORS.COMPETITION.NOT_FOUND(code);
    if (leaderboardQuery.isError) return ERRORS.COMPETITION.FETCH_LEADERBOARD;
    if (actionsQuery.isError) return ERRORS.COMPETITION.FETCH_ACTIONS;
    return null;
  };

  return {
    competition: competitionQuery.data,
    leaderboard: leaderboardQuery.data ?? [],
    actions: actionsQuery.data ?? [],
    isReady: !isInitialLoading,
    isRefreshing:
      competitionQuery.isFetching ||
      leaderboardQuery.isFetching ||
      actionsQuery.isFetching,
    error: getErrorMessage(),
    refresh,
  };
};
