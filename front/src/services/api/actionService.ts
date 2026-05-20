import type { Action, ActionCreatePayload, ActionUpdatePayload } from '@/types';
import { API, apiFetch } from '@/shared';

export const actionService = {
  create: async (
    competitionId: string,
    payload: ActionCreatePayload,
  ): Promise<{ ok: boolean; data: Action }> => {
    const response = await apiFetch(
      API.ENDPOINTS.COMPETITIONS.ACTIONS(competitionId),
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
    return { ok: response.ok, data: await response.json() };
  },

  update: async (
    id: string,
    data: ActionUpdatePayload,
  ): Promise<{ ok: boolean; data: Action }> => {
    const response = await apiFetch(API.ENDPOINTS.ACTIONS.DETAIL(id), {
      method: 'PATCH',
      headers: { 'Content-Type': API.GROUPS.MERGE_PATCH },
      body: JSON.stringify(data),
    });
    return { ok: response.ok, data: await response.json() };
  },

  getGlobalPendingCount: async (signal?: AbortSignal) => {
    const response = await apiFetch(API.ENDPOINTS.REFEREE.PENDING_GLOBAL, {
      signal,
    });
    if (!response.ok) return 0;
    const data = await response.json();
    return data.count;
  },
};
