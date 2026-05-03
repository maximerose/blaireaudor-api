import type { BonusDay } from '@/types';
import { apiFetch } from './config';
import { API } from '@/constants';

export const bonusDayService = {
  create: async (competitionId: string, date: string, multiplier: number) => {
    const response = await apiFetch(API.ENDPOINTS.BONUS.BASE, {
      method: 'POST',
      body: JSON.stringify({
        date,
        multiplier,
        competition: API.IRI.COMPETITION(competitionId),
      }),
    });

    if (!response.ok) throw new Error('Erreur lors de la création du bonus');
    return response.json();
  },

  delete: async (bonusDayId: string) => {
    const response = await apiFetch(API.ENDPOINTS.BONUS.DETAIL(bonusDayId), {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Erreur lors de la suppression du bonus');
  },

  getByCompetition: async (competitionId: string): Promise<BonusDay[]> => {
    const response = await apiFetch(
      API.ENDPOINTS.BONUS.BY_COMPETITION(competitionId),
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des jours bonus');
    }

    const data = await response.json();

    return data['hydra:member'] || data['member'] || [];
  },
};
