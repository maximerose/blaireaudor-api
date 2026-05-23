import { API, apiFetch } from '@/shared';
import type {
  Action,
  Competition,
  CompetitionCreatePayload,
  CompetitionUpdatePayload,
  GetActionsParams,
  Participation,
} from '@/features/competition/types';

export const competitionService = {
  create: async (payload: CompetitionCreatePayload): Promise<Competition> => {
    const response = await apiFetch(API.ENDPOINTS.COMPETITIONS.BASE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  update: async (
    id: string,
    data: CompetitionUpdatePayload,
  ): Promise<Competition> => {
    const response = await apiFetch(API.ENDPOINTS.COMPETITIONS.DETAIL(id), {
      method: 'PATCH',
      headers: { 'Content-Type': API.GROUPS.MERGE_PATCH },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: string): Promise<true> => {
    await apiFetch(API.ENDPOINTS.COMPETITIONS.DETAIL(id), { method: 'DELETE' });
    return true;
  },

  getByCode: async (
    code: string,
    signal?: AbortSignal,
  ): Promise<{ competition: Competition; leaderboard: Participation[] }> => {
    const response = await apiFetch(API.ENDPOINTS.COMPETITIONS.BY_CODE(code), {
      signal,
    });
    return response.json();
  },

  checkJoinCode: async (
    code: string,
    signal?: AbortSignal,
  ): Promise<{ available: boolean }> => {
    const response = await apiFetch(
      API.ENDPOINTS.COMPETITIONS.CHECK_JOIN_CODE(code),
      { signal },
    );
    return response.json();
  },

  join: async (joinCode: string): Promise<Participation> => {
    const response = await apiFetch(API.ENDPOINTS.COMPETITIONS.JOIN, {
      method: 'POST',
      body: JSON.stringify({ joinCode }),
    });
    return response.json();
  },

  getLeaderboard: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<Participation[]> => {
    const response = await apiFetch(
      API.ENDPOINTS.COMPETITIONS.LEADERBOARD(id),
      { signal },
    );
    return response.json();
  },

  getActions: async ({
    id,
    page = 1,
    selectedDate,
    selectedPlayerId,
    sortField,
    sortOrder,
    signal,
  }: GetActionsParams): Promise<{
    data: Action[];
    meta: { total: number; page: number; last_page: number };
  }> => {
    const params = new URLSearchParams({ page: page.toString() });
    if (selectedDate) params.append('date', selectedDate);
    if (selectedPlayerId) params.append('playerId', selectedPlayerId);
    if (sortField) params.append('sort', sortField);
    if (sortOrder) params.append('order', sortOrder);

    const response = await apiFetch(
      `${API.ENDPOINTS.COMPETITIONS.ACTIONS(id)}?${params.toString()}`,
      { signal },
    );
    return response.json();
  },

  getActionsDates: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<string[]> => {
    const response = await apiFetch(
      API.ENDPOINTS.COMPETITIONS.ACTIONS_DATES(id),
      { signal },
    );
    return response.json();
  },

  addParticipation: async (
    competitionId: string,
    participants: {
      existing_players_ids?: string[];
      new_players?: string[];
      existing_referees_ids?: string[];
      new_referees?: string[];
    },
  ): Promise<unknown> => {
    const response = await apiFetch(
      API.ENDPOINTS.COMPETITIONS.ADD_PARTICIPANTS(competitionId),
      {
        method: 'POST',
        body: JSON.stringify({
          existing_players_ids: [],
          new_players: [],
          existing_referees_ids: [],
          new_referees: [],
          ...participants,
        }),
      },
    );
    return response.json();
  },

  getPendingCount: async (
    competitionId: string,
    signal?: AbortSignal,
  ): Promise<number> => {
    const response = await apiFetch(
      API.ENDPOINTS.COMPETITIONS.PENDING_COUNT(competitionId),
      { signal },
    );
    const data = await response.json();
    return data.count;
  },

  removeParticipation: async (participationId: string): Promise<true> => {
    await apiFetch(API.ENDPOINTS.PARTICIPATIONS.DETAIL(participationId), {
      method: 'DELETE',
    });
    return true;
  },

  addReferee: async (
    competitionId: string,
    playerId: string,
  ): Promise<Competition> => {
    const response = await apiFetch(
      API.ENDPOINTS.COMPETITIONS.ADD_REFEREE(competitionId),
      {
        method: 'POST',
        body: JSON.stringify({ player_id: playerId }),
      },
    );
    return response.json();
  },

  removeReferee: async (
    competitionId: string,
    playerId: string,
  ): Promise<true> => {
    await apiFetch(API.ENDPOINTS.COMPETITIONS.REMOVE_REFEREE(competitionId), {
      method: 'POST',
      body: JSON.stringify({ player_id: playerId }),
    });
    return true;
  },
};
