import type { Player } from '@/features/player';
import { getIdFromData, resolvePlayerId, resolveUserId } from '@/shared';
import {
  CompetitionStatus,
  type Competition,
  type CompetitionStatusType,
  type EnrichedLeaderboardItem,
} from '@/features/competition';
import type { User } from '@/features/account';

/**
 * 🎯 STATUTS & COMPTEURS TEMPLES
 */

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
 * Vérifie si on peut afficher les scores de la compétition (terminée ou brouillard inactif)
 */
export const canRevealScores = (competition: Competition): boolean =>
  competition.is_finished || !competition.fog_of_war;

/**
 * 👑 RÔLES, DROITS & PERMISSIONS
 */

/**
 * Résout l'ID du créateur d'une compétition
 */
export const resolveCreatorId = (
  competition: Competition | null | undefined,
): string | null => {
  if (!competition?.created_by) return null;
  return getIdFromData(competition.created_by);
};

/**
 * Résout le nom d'affichage du créateur (Logique exhaustive)
 */
export const resolveCreatorName = (
  competition: Competition | null | undefined,
  leaderboard: EnrichedLeaderboardItem[] = [],
  currentUser: User | null,
): string | null => {
  if (!competition) return null;
  if (competition.creator_name) return competition.creator_name;

  const creatorId = resolveCreatorId(competition);
  if (!creatorId) return null;

  if (currentUser && getIdFromData(currentUser) === creatorId) {
    return currentUser.player?.display_name || null;
  }

  const inLeaderboard = leaderboard.find(
    (item) => item.player?.id === creatorId,
  );
  return inLeaderboard?.player.display_name || null;
};

/**
 * Extrait et formate la liste des arbitres d'une compétition
 */
export const getCompetitionReferees = (
  competition: Competition | null | undefined,
) => {
  if (!competition?.referees) return [];

  return competition.referees.map((ref: Player | string) => {
    const id = getIdFromData(ref);

    let name = 'Arbitre';
    let userId = null;
    if (typeof ref === 'object' && ref !== null) {
      name = ref.display_name || ref.username || 'Arbitre';
      userId = ref.associated_user?.id || getIdFromData(ref.associated_user);
    }

    return { id, name, userId };
  });
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
