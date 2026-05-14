import {
  type Player,
  type Competition,
  type User,
  type CompetitionStatusType,
  CompetitionStatus,
} from '@/types';
import {
  getIdFromData,
  resolveCreatorId,
  resolvePlayerId,
  resolveUserId,
} from '@/utils';

/**
 * Détermine le statut (Cohérence avec la fin de journée forcée)
 */
export const getCompetitionStatus = (
  startDateStr: string,
  endDateStr: string | null,
) => {
  const now = new Date();
  const start = new Date(startDateStr);
  const end = endDateStr ? new Date(endDateStr) : null;
  if (now < start) return CompetitionStatus.UPCOMING;
  if (end && now > end) return CompetitionStatus.FINISHED;
  return CompetitionStatus.ACTIVE;
};

/**
 * Pour le tri (Dashboard), on donne un poids à chaque statut.
 */
export const getStatusWeight = (status: CompetitionStatusType): number => {
  const weights = {
    [CompetitionStatus.ACTIVE]: 1,
    [CompetitionStatus.UPCOMING]: 2,
    [CompetitionStatus.FINISHED]: 3,
  };
  return weights[status] || 4;
};

/**
 * Vérifie si le sujet est le CRÉATEUR (basé sur l'User ID)
 */
export const isCreator = (
  competition: Competition | null | undefined,
  subject: User | Player | string | null | undefined,
): boolean => {
  const creatorId = resolveCreatorId(competition);
  const userId = resolveUserId(subject);
  return !!(creatorId && userId && creatorId === userId);
};

/**
 * Vérifie si le sujet est un ARBITRE (basé sur le Player ID)
 */
export const isReferee = (
  competition: Competition | null | undefined,
  subject: User | Player | string | null | undefined,
): boolean => {
  const playerId = resolvePlayerId(subject);
  if (!competition?.referees || !playerId) return false;
  return competition.referees.some((ref) => getIdFromData(ref) === playerId);
};

/**
 * Vérifie si le sujet est un PARTICIPANT (basé sur le Player ID)
 */
export const isParticipant = (
  competition: Competition | null | undefined,
  subject: User | Player | string | null | undefined,
): boolean => {
  const playerId = resolvePlayerId(subject);
  if (!competition?.participations || !playerId) return false;
  return competition.participations.some(
    (p) => getIdFromData(p.player) === playerId,
  );
};

/**
 * Vérifie si le sujet peut gérer (Créateur OU Arbitre)
 */
export const canManage = (
  competition: Competition | null | undefined,
  subject: User | Player | string | null | undefined,
): boolean =>
  isCreator(competition, subject) || isReferee(competition, subject);

/**
 * Vérifie si on peut afficher les scores de la compétition (terminée ou brouillard inactif)
 */
export const canRevealScores = (competition: Competition): boolean =>
  competition.is_finished || !competition.fog_of_war;
