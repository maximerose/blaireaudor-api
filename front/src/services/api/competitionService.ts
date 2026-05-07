import { apiFetch } from './configService';
import { API, ERRORS } from '@/constants';
import type {
  CompetitionCreatePayload,
  CompetitionUpdatePayload,
} from '@/types';

export const competitionService = {
  create: async (payload: CompetitionCreatePayload) => {
    const response = await apiFetch(API.ENDPOINTS.ADMIN.COMPETITION_CREATE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(ERRORS.SYMFONY_DETAILS, result);
      throw new Error(ERRORS.COMPETITION.CREATE_FAILED);
    }

    return result;
  },

  update: async (id: string, data: CompetitionUpdatePayload) => {
    const response = await apiFetch(API.ENDPOINTS.COMPETITIONS.DETAIL(id), {
      method: 'PATCH',
      headers: { 'Content-Type': API.GROUPS.MERGE_PATCH },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(ERRORS.COMPETITION.UPDATE_FAILED);
    return response.json();
  },

  delete: async (id: string) => {
    const response = await apiFetch(API.ENDPOINTS.COMPETITIONS.DETAIL(id), {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(ERRORS.COMPETITION.DELETE_FAILED);
    return true;
  },

  getByCode: async (code: string, signal?: AbortSignal) => {
    const response = await apiFetch(API.ENDPOINTS.COMPETITIONS.BY_CODE(code), {
      signal,
    });
    if (!response.ok) throw new Error(ERRORS.COMPETITION.NOT_FOUND(code));
    return response.json();
  },

  join: async (playerId: string, competitionId: string) => {
    const response = await apiFetch(API.ENDPOINTS.PARTICIPATIONS.BASE, {
      method: 'POST',
      body: JSON.stringify({
        player: API.IRI.PLAYER(playerId),
        competition: API.IRI.COMPETITION(competitionId),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.violations?.[0]?.message ||
          ERRORS.COMPETITION.PARTICIPATION_ADD_FAILED,
      );
    }
    return response.json();
  },

  getLeaderboard: async (id: string, signal?: AbortSignal) => {
    const response = await apiFetch(
      API.ENDPOINTS.COMPETITIONS.LEADERBOARD(id),
      { signal },
    );
    if (!response.ok) throw new Error(ERRORS.COMPETITION.FETCH_LEADERBOARD);
    return response.json();
  },

  getActions: async (id: string, signal?: AbortSignal) => {
    const response = await apiFetch(API.ENDPOINTS.COMPETITIONS.ACTIONS(id), {
      signal,
    });
    if (!response.ok) throw new Error(ERRORS.COMPETITION.FETCH_ACTIONS);
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
  ) => {
    const response = await apiFetch(
      API.ENDPOINTS.ADMIN.ADD_PARTICIPANTS(competitionId),
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

    if (!response.ok)
      throw new Error(ERRORS.COMPETITION.PARTICIPATION_ADD_FAILED);
    return response.json();
  },

  /**
   * Supprime une participation spécifique (retire un joueur de la compétition)
   */
  removeParticipation: async (participationId: string) => {
    const response = await apiFetch(
      API.ENDPOINTS.PARTICIPATIONS.DETAIL(participationId),
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error(ERRORS.COMPETITION.PARTICIPATION_REMOVE_FAILED);
    }

    return true;
  },

  addReferee: async (competitionId: string, playerId: string) => {
    const response = await apiFetch(
      API.ENDPOINTS.ADMIN.ADD_REFEREE(competitionId),
      {
        method: 'POST',
        body: JSON.stringify({ player_id: playerId }),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || ERRORS.COMPETITION.REFEREE_ADD_FAILED);
    }
    return response.json();
  },

  removeReferee: async (competitionId: string, playerId: string) => {
    const response = await apiFetch(
      API.ENDPOINTS.ADMIN.REMOVE_REFEREE(competitionId),
      {
        method: 'POST',
        body: JSON.stringify({ player_id: playerId }),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || ERRORS.COMPETITION.REFEREE_REMOVE_FAILED);
    }
    return true;
  },
};
