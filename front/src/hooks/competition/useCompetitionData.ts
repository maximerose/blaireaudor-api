import { useQuery, useQueryClient } from '@tanstack/react-query';
import { competitionService } from '@/services/api/competition';

export const useCompetitionData = (code: string) => {
  const queryClient = useQueryClient();

  const competitionQuery = useQuery({
    queryKey: ['competition', code],
    queryFn: () => competitionService.getByCode(code),
    enabled: !!code,
    staleTime: 1000 * 60 * 5,
  });

  const competitionId = competitionQuery.data?.id;

  const leaderboardQuery = useQuery({
    queryKey: ['competition', competitionId, 'leaderboard'],
    queryFn: () => competitionService.getLeaderboard(competitionId!),
    enabled: !!competitionId,
  });

  const actionsQuery = useQuery({
    queryKey: ['competition', competitionId, 'actions'],
    queryFn: () => competitionService.getActions(competitionId!),
    enabled: !!competitionId,
  });

  /**
   * Fonction de rafraîchissement global :
   * Invalide toutes les requêtes liées à cette compétition pour forcer un re-fetch.
   */
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['competition', code] });

    if (competitionId) {
      queryClient.invalidateQueries({
        queryKey: ['competition', competitionId],
      });
    }
  };

  return {
    competition: competitionQuery.data,
    leaderboard: leaderboardQuery.data ?? [],
    actions: actionsQuery.data ?? [],
    loading:
      competitionQuery.isLoading ||
      (!!competitionId &&
        (leaderboardQuery.isLoading || actionsQuery.isLoading)),
    error:
      competitionQuery.error || leaderboardQuery.error || actionsQuery.error,
    refresh,
  };
};
