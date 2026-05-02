import { ROUTES } from '@/constants/routes';
import { apiFetch } from './config';

export const fetchCompetitionByCode = async (code: string) => {
  const response = await apiFetch(ROUTES.API_COMPETITION_BY_CODE(code));
  if (!response.ok) throw new Error(`Compétition introuvable (code: ${code})`);
  return response.json();
};

export const fetchLeaderboard = async (competitionId: string) => {
  const response = await apiFetch(
    ROUTES.API_COMPETITION_LEADERBOARD(competitionId),
  );
  if (!response.ok) throw new Error('Erreur lors du chargement du classement');
  return response.json();
};

export const fetchCompetitionActions = async (competitionId: string) => {
  const response = await apiFetch(
    ROUTES.API_COMPETITION_ACTIONS(competitionId),
  );
  if (!response.ok) throw new Error('Erreur lors du chargement des actions');
  return response.json();
};
