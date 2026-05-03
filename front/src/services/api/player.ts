import type { Player } from '@/types/player';
import { apiFetch } from './config';
import { API } from '@/constants';

export const playerService = {
  search: async (term: string): Promise<Player[]> => {
    const response = await apiFetch(API.ENDPOINTS.PLAYER.SEARCH(term));
    if (!response.ok) throw new Error('Erreur lors de la recherche');

    const data = await response.json();
    return Array.isArray(data)
      ? data
      : data['hydra:member'] || data.member || [];
  },
};
