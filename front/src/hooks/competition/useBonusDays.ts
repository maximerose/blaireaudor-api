import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { bonusDayService } from '@/services/api/bonusDayService';
import { QUERY_KEYS } from '@/constants';

export const useBonusDays = (competitionId: string) => {
  const { code } = useParams<{ code: string }>();
  const idToUse = competitionId || code;

  return useQuery({
    queryKey: QUERY_KEYS.competition.byId(idToUse).bonus,
    queryFn: () => bonusDayService.getByCompetition(idToUse!),
    enabled: !!idToUse,
  });
};
