import { useQuery } from '@tanstack/react-query';
import { bonusDayService } from '@/features/competition';
import { QUERY_KEYS } from '@/shared';

export const useBonusDays = (competitionId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.competition.byId(competitionId).bonus,
    queryFn: ({ signal }) =>
      bonusDayService.getByCompetition(competitionId, signal),
    enabled: !!competitionId,
  });
};
