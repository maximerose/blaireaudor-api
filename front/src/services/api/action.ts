import { ROUTES } from '@/constants/routes';
import { apiFetch } from './config';

export const actionService = {
  create: async (competitionId: string, payload: any) => {
    const response = await apiFetch(
      ROUTES.API.COMPETITIONS.ACTIONS(competitionId),
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
    return { ok: response.ok, data: await response.json() };
  },

  update: async (id: string, data: any) => {
    const response = await apiFetch(ROUTES.API.ACTIONS.DETAIL(id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/merge-patch+json' },
      body: JSON.stringify(data),
    });
    return { ok: response.ok, data: await response.json() };
  },
};
