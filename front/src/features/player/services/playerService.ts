import { API, apiFetch } from '@/shared';
import type { Player } from '@/features/player/types';

/**
 * Recherche des joueurs par mot-clé
 */
export const playerService = {
  search: async (term: string, signal?: AbortSignal): Promise<Player[]> => {
    const response = await apiFetch(API.ENDPOINTS.PLAYER.SEARCH(term), {
      signal,
    });

    const data = await response.json();

    return Array.isArray(data)
      ? data
      : data['hydra:member'] || data.member || [];
  },
};
