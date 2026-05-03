import { apiFetch } from './config';
import { formatToApiISO } from '@/utils';
import { API } from '@/constants';

export const competitionService = {
  create: async (data: any) => {
    const formattedStartDate = formatToApiISO(
      data.startDate,
      data.startTime,
      data.startFullDay,
      false,
    );
    const formattedEndDate = data.endDate
      ? formatToApiISO(data.endDate, data.endTime, data.endFullDay, true)
      : null;

    const response = await apiFetch(API.ENDPOINTS.COMPETITIONS.BASE, {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        join_code: data.joinCode || null,
        participate: data.participate ?? true,
        fog_of_war: data.fogOfWar,
        is_creator_referee: data.isCreatorReferee ?? true,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Détails de l'erreur Symfony:", result);
      throw new Error('Erreur lors de la création de la compétition');
    }

    return result;
  },

  update: async (id: string, data: any) => {
    const response = await apiFetch(API.ENDPOINTS.COMPETITIONS.DETAIL(id), {
      method: 'PATCH',
      headers: { 'Content-Type': API.GROUPS.MERGE_PATCH },
      body: JSON.stringify(data),
    });
    return { ok: response.ok, data: await response.json() };
  },

  delete: async (id: string) => {
    const response = await apiFetch(API.ENDPOINTS.COMPETITIONS.DETAIL(id), {
      method: 'DELETE',
    });
    return response.ok;
  },

  getByCode: async (code: string) => {
    const response = await apiFetch(API.ENDPOINTS.COMPETITIONS.BY_CODE(code));
    if (!response.ok) throw new Error(`Arène introuvable (code: ${code})`);
    return response.json();
  },

  getLeaderboard: async (id: string) => {
    const response = await apiFetch(API.ENDPOINTS.COMPETITIONS.LEADERBOARD(id));
    if (!response.ok) throw new Error('Erreur chargement classement');
    return response.json();
  },

  getActions: async (id: string) => {
    const response = await apiFetch(API.ENDPOINTS.COMPETITIONS.ACTIONS(id));
    if (!response.ok) throw new Error('Erreur chargement actions');
    return response.json();
  },

  addParticipants: async (
    competitionId: string,
    participants: {
      existing_players_ids: string[];
      new_players: string[];
      existing_referees_ids: string[];
      new_referees: string[];
    },
  ) => {
    const response = await apiFetch(
      API.ENDPOINTS.ADMIN.ADD_PARTICIPANTS(competitionId),
      {
        method: 'POST',
        body: JSON.stringify(participants),
      },
    );

    if (!response.ok)
      throw new Error("Erreur lors de l'ajout des participants");
    return response.json();
  },

  addReferee: async (competitionId: string, playerId: string) => {
    return apiFetch(API.ENDPOINTS.ADMIN.ADD_REFEREE(competitionId), {
      method: 'POST',
      body: JSON.stringify({ player_id: playerId }),
    });
  },

  removeReferee: async (competitionId: string, playerId: string) => {
    return apiFetch(API.ENDPOINTS.ADMIN.REMOVE_REFEREE(competitionId), {
      method: 'POST',
      body: JSON.stringify({ player_id: playerId }),
    });
  },
};
