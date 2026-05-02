import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchCompetitionByCode,
  fetchLeaderboard,
  fetchCompetitionActions,
} from '@/services/api/competition';

export const useCompetitionData = (code: string) => {
  const queryClient = useQueryClient();

  // 1. Récupération de la compétition via le joinCode
  const competitionQuery = useQuery({
    queryKey: ['competition', code],
    queryFn: () => fetchCompetitionByCode(code),
    enabled: !!code,
    staleTime: 1000 * 60 * 5,
  });

  const competitionId = competitionQuery.data?.id;

  // 2. Récupération du classement (dépend de l'ID)
  const leaderboardQuery = useQuery({
    queryKey: ['competition', competitionId, 'leaderboard'],
    queryFn: () => fetchLeaderboard(competitionId!),
    enabled: !!competitionId,
  });

  // 3. Récupération des actions (dépend de l'ID)
  const actionsQuery = useQuery({
    queryKey: ['competition', competitionId, 'actions'],
    queryFn: () => fetchCompetitionActions(competitionId!),
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
