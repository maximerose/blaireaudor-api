import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { bonusDayService } from '@/services/api/bonusDay';

export const useBonusDays = (competitionId: string) => {
  const { code } = useParams<{ code: string }>();
  const idToUse = competitionId || code;

  return useQuery({
    queryKey: ['bonusDays', idToUse],
    queryFn: () => bonusDayService.getByCompetition(idToUse!),
    enabled: !!idToUse,
  });
};
