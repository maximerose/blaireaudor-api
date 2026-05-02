import { ROUTES } from '@/constants/routes';
import { apiFetch } from './config';

export const competitionService = {
  getByCode: async (code: string) => {
    const response = await apiFetch(ROUTES.API_COMPETITION_BY_CODE(code));
    if (!response.ok) throw new Error(`Arène introuvable (code: ${code})`);
    return response.json();
  },

  getLeaderboard: async (id: string) => {
    const response = await apiFetch(ROUTES.API_COMPETITION_LEADERBOARD(id));
    if (!response.ok) throw new Error('Erreur chargement classement');
    return response.json();
  },

  getActions: async (id: string) => {
    const response = await apiFetch(ROUTES.API_COMPETITION_ACTIONS(id));
    if (!response.ok) throw new Error('Erreur chargement actions');
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await apiFetch(ROUTES.API_COMPETITION_DETAIL(id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/merge-patch+json' },
      body: JSON.stringify(data),
    });
    return { ok: response.ok, data: await response.json() };
  },

  delete: async (id: string) => {
    const response = await apiFetch(ROUTES.API_COMPETITION_DETAIL(id), {
      method: 'DELETE',
    });
    return response.ok;
  },

  addReferee: async (competitionId: string, playerId: string) => {
    return apiFetch(ROUTES.API_ADD_REFEREE(competitionId), {
      method: 'POST',
      body: JSON.stringify({ player_id: playerId }),
    });
  },

  removeReferee: async (competitionId: string, playerId: string) => {
    return apiFetch(ROUTES.API_REMOVE_REFEREE(competitionId), {
      method: 'POST',
      body: JSON.stringify({ player_id: playerId }),
    });
  },
};
