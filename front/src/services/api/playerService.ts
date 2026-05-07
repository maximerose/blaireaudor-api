import type { Player } from '@/types/player';
import { apiFetch } from './configService';
import { API } from '@/constants';

export const playerService = {
  search: async (term: string, signal?: AbortSignal): Promise<Player[]> => {
    const response = await apiFetch(API.ENDPOINTS.PLAYER.SEARCH(term), {
      signal,
    });

    if (!response.ok) throw new Error('Erreur lors de la recherche');

    const data = await response.json();
    return Array.isArray(data)
      ? data
      : data['hydra:member'] || data.member || [];
  },
};
