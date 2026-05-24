import type { BonusDay } from '@/features/competition/types';
import { API, apiFetch } from '@/shared';

export const bonusDayService = {
  /**
   * Crée un nouveau jour bonus pour une compétition
   */
  create: async (
    competitionId: string,
    date: string,
    multiplier: number,
  ): Promise<BonusDay> => {
    const response = await apiFetch(API.ENDPOINTS.BONUS.BASE, {
      method: 'POST',
      body: JSON.stringify({
        date,
        multiplier,
        competition: API.IRI.COMPETITION(competitionId),
      }),
    });

    return response.json();
  },

  /**
   * Supprime un jour bonus
   */
  delete: async (bonusDayId: string): Promise<void> => {
    await apiFetch(API.ENDPOINTS.BONUS.DETAIL(bonusDayId), {
      method: 'DELETE',
    });
  },

  /**
   * Récupère tous les jours bonus d'une compétition
   */
  getByCompetition: async (
    competitionId: string,
    signal?: AbortSignal,
  ): Promise<BonusDay[]> => {
    const response = await apiFetch(
      API.ENDPOINTS.BONUS.BY_COMPETITION(competitionId),
      { signal },
    );

    const data = await response.json();

    return data['hydra:member'] || data['member'] || [];
  },
};
