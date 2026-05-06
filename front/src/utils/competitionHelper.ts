import type { Player, Competition, User } from '@/types';
import { getIdFromData } from './api';
import type { EnrichedLeaderboardItem } from '@/hooks';

export const CompetitionStatus = {
  ACTIVE: 'ACTIVE',
  UPCOMING: 'UPCOMING',
  FINISHED: 'FINISHED',
} as const;

export type CompetitionStatusType =
  (typeof CompetitionStatus)[keyof typeof CompetitionStatus];

/**
 * Formate une date en français
 */
export const formatFrenchDate = (
  dateStr: string | null | undefined,
): string | null => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Génère le libellé de la période
 */
export const getDisplayDateText = (
  startDateStr: string | null | undefined,
  endDateStr?: string | null,
) => {
  if (!startDateStr) return 'Date inconnue';

  const formattedStart = formatFrenchDate(startDateStr);
  const formattedEnd = formatFrenchDate(endDateStr);

  if (formattedStart && formattedEnd) {
    return `Du ${formattedStart} au ${formattedEnd}`;
  } else if (formattedStart && new Date(startDateStr) < new Date()) {
    return `Débuté le ${formattedStart}`;
  } else if (formattedStart) {
    return `Débutera le ${formattedStart}`;
  }
  return 'Date inconnue';
};

export const canRevealScores = (competition: Competition): boolean => {
  return competition.is_finished || !competition.fog_of_war;
};

/**
 * Détermine le statut (Cohérence avec la fin de journée forcée)
 */
export const getCompetitionStatus = (
  startDateStr: string,
  endDateStr: string | null,
): CompetitionStatusType => {
  const now = new Date();
  const start = new Date(startDateStr);
  const end = endDateStr ? new Date(endDateStr) : null;

  if (now < start) return CompetitionStatus.UPCOMING;
  if (end) {
    if (now > end) return CompetitionStatus.FINISHED;
  }

  return CompetitionStatus.ACTIVE;
};

export const getStatusWeight = (status: CompetitionStatusType): number => {
  switch (status) {
    case CompetitionStatus.ACTIVE:
      return 1;
    case CompetitionStatus.UPCOMING:
      return 2;
    case CompetitionStatus.FINISHED:
      return 3;
    default:
      return 4;
  }
};

export const formatShortDate = (dateString: string | Date): string => {
  return new Date(dateString)
    .toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
    })
    .replace('.', '');
};

// ============================================================================
// GESTION DES RÔLES ET DES ARBITRES
// ============================================================================

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
    if (typeof ref === 'object' && ref !== null) {
      name = ref.display_name || ref.username || 'Arbitre';
    }

    return { id, name };
  });
};

/**
 * Vérifie si un joueur spécifique est arbitre de la compétition
 */
export const isPlayerReferee = (
  competition: Competition | null | undefined,
  playerId?: string | null,
): boolean => {
  if (!competition?.referees || !playerId) return false;

  return competition.referees.some((ref: Player | string) => {
    return getIdFromData(ref) === playerId;
  });
};

/**
 * Utilitaire interne pour extraire l'ID du créateur peu importe le format de l'API
 */
const resolveCreatorId = (
  competition: Competition | null | undefined,
): string | null => {
  if (!competition?.created_by) return null;
  return getIdFromData(competition.created_by);
};

/**
 * Vérifie si un joueur spécifique est créateur de la compétition
 */
export const isPlayerCreator = (
  competition: Competition | null | undefined,
  player: Player | null,
): boolean => {
  if (!competition || !player) return false;

  const creatorId = resolveCreatorId(competition);
  if (!creatorId) return false;

  const playerUserId = player.associated_user
    ? getIdFromData(player.associated_user)
    : null;

  return creatorId === playerUserId;
};

/**
 * Vérifie si un utilisateur est le créateur de la compétition
 */
export const isCompetitionCreator = (
  competition: Competition | null | undefined,
  user?: User | null,
): boolean => {
  if (!competition || !user) return false;

  const creatorId = resolveCreatorId(competition);
  const userId = getIdFromData(user);

  return creatorId !== null && creatorId === userId;
};

/**
 * Résout le nom du créateur de façon exhaustive
 */
export const resolveCreatorName = (
  competition: Competition | null | undefined,
  leaderboard: EnrichedLeaderboardItem[] = [],
  currentUser: User | null,
): string | null => {
  if (!competition) return null;

  const apiName = competition.creator_name;
  if (apiName) return apiName;

  const creatorId = resolveCreatorId(competition);
  if (!creatorId) return null;

  if (currentUser && getIdFromData(currentUser) === creatorId) {
    return currentUser.player?.display_name || null;
  }

  const inLeaderboard = leaderboard.find(
    (item) => item.player?.id === creatorId,
  );

  if (inLeaderboard) return inLeaderboard.player.display_name || null;

  return null;
};

/**
 * Vérifie si l'utilisateur a les droits d'administration sur la compétition
 * (Créateur OU Arbitre)
 */
export const canManageCompetition = (
  competition: Competition | null | undefined,
  user: User | null,
): boolean => {
  return (
    isCompetitionCreator(competition, user) ||
    isPlayerReferee(competition, user?.player?.id)
  );
};
