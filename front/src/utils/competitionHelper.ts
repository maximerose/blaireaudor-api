import type { Player, Competition } from '@/types';

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
  startDateStr: string,
  endDateStr?: string | null,
) => {
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
export const getCompetitionReferees = (competition: any) => {
  if (!competition?.referees) return [];

  return competition.referees.map((ref: any) => {
    const id = typeof ref === 'string' ? ref.split('/').pop() : ref.id;
    const name =
      typeof ref === 'string'
        ? 'Arbitre'
        : ref.display_name || ref.displayName || ref.username || 'Arbitre';

    return { id, name };
  });
};

/**
 * Vérifie si un joueur spécifique est arbitre de la compétition
 */
export const isPlayerReferee = (
  competition: any,
  playerId: string | undefined,
): boolean => {
  if (!competition?.referees || !playerId) return false;

  return competition.referees.some((ref: any) => {
    const refId = typeof ref === 'string' ? ref.split('/').pop() : ref.id;
    return refId === playerId;
  });
};

/**
 * Vérifie si un joueur spécifique est créateur de la compétition
 */
export const isPlayerCreator = (
  competition: any,
  player: Player | undefined,
): boolean => {
  if (!competition || !player) return false;

  const creator = competition.created_by || competition.createdBy;
  if (!creator) return false;

  const creatorId =
    typeof creator === 'string' ? creator.split('/').pop() : creator.id;

  if (!player.associated_user) return false;

  return creatorId === player.associated_user?.id;
};

/**
 * Vérifie si un utilisateur est le créateur de la compétition
 */
export const isCompetitionCreator = (competition: any, user: any): boolean => {
  if (!competition || !user) return false;

  const creator = competition.createdBy || competition.created_by;
  if (!creator) return false;

  const creatorId =
    typeof creator === 'string' ? creator.split('/').pop() : creator.id;

  return (
    creatorId === user.id ||
    creator === user.username ||
    creator === `/api/users/${user.id}`
  );
};

/**
 * Résout le nom du créateur de façon exhaustive
 */
export const resolveCreatorName = (
  competition: any,
  leaderboard: any[] = [],
  currentUser: any = null,
): string | null => {
  if (!competition) return null;

  const apiName = competition.creatorName || competition.creator_name;
  if (apiName) return apiName;

  const creator = competition.createdBy || competition.created_by;
  if (!creator) return null;
  const creatorId =
    typeof creator === 'string' ? creator.split('/').pop() : creator.id;

  if (currentUser && currentUser.id === creatorId) {
    return currentUser.player?.display_name;
  }

  const inLeaderboard = leaderboard.find(
    (item) => item.player?.id === creatorId,
  );
  if (inLeaderboard) return inLeaderboard.player.display_name;

  return null;
};

/**
 * Vérifie si l'utilisateur a les droits d'administration sur la compétition
 * (Créateur OU Arbitre)
 */
export const canManageCompetition = (competition: any, user: any): boolean => {
  return (
    isCompetitionCreator(competition, user) ||
    isPlayerReferee(competition, user?.player?.id)
  );
};
