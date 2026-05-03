import { apiFetch } from './config';
import { API } from '@/constants';

export const actionService = {
  create: async (competitionId: string, payload: any) => {
    const response = await apiFetch(
      API.ENDPOINTS.COMPETITIONS.ACTIONS(competitionId),
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
    return { ok: response.ok, data: await response.json() };
  },

  update: async (id: string, data: any) => {
    const response = await apiFetch(API.ENDPOINTS.ACTIONS.DETAIL(id), {
      method: 'PATCH',
      headers: { 'Content-Type': API.GROUPS.MERGE_PATCH },
      body: JSON.stringify(data),
    });
    return { ok: response.ok, data: await response.json() };
  },
};
