import { API, apiFetch } from '@/shared';
import type {
  Action,
  ActionCreatePayload,
  ActionUpdatePayload,
} from '@/features/competition/types';

export const actionService = {
  create: async (
    competitionId: string,
    payload: ActionCreatePayload,
  ): Promise<Action> => {
    const response = await apiFetch(
      API.ENDPOINTS.COMPETITIONS.ACTIONS(competitionId),
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
    return response.json();
  },

  update: async (id: string, data: ActionUpdatePayload): Promise<Action> => {
    const response = await apiFetch(API.ENDPOINTS.ACTIONS.DETAIL(id), {
      method: 'PATCH',
      headers: { 'Content-Type': API.GROUPS.MERGE_PATCH },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getGlobalPendingCount: async (signal?: AbortSignal): Promise<number> => {
    const response = await apiFetch(API.ENDPOINTS.REFEREE.PENDING_GLOBAL, {
      signal,
    });

    const data = await response.json();
    return data.count;
  },
};
