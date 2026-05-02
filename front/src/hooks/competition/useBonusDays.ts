import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/services/api/config';
import { ROUTES } from '@/constants/routes';
import { useParams } from 'react-router-dom';

export interface BonusDay {
  id: string;
  date: string;
  multiplier: number;
}

export const useBonusDays = (competitionId: string) => {
  const { code } = useParams<{ code: string }>();
  const idToUse = competitionId || code;

  return useQuery({
    queryKey: ['bonusDays', idToUse],
    queryFn: async (): Promise<BonusDay[]> => {
      const response = await apiFetch(
        ROUTES.API_BONUS_DAYS_BY_COMPETITION(idToUse!),
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des jours bonus');
      }

      const data = await response.json();

      return data['hydra:member'] || data['member'] || [];
    },
    enabled: !!idToUse,
  });
};
