import { type Competition } from '../context/AuthContext';

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
 * Détermine si une compétition est terminée (Après 23:59:59 du jour de fin)
 */
export const getIsFinished = (
  endDateStr: string | null | undefined,
): boolean => {
  if (!endDateStr) return false;
  const endDate = new Date(endDateStr);
  if (isNaN(endDate.getTime())) return false;

  endDate.setHours(23, 59, 59, 999);
  return endDate < new Date();
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

export const canRevealScores = (
  competition: Competition,
  isFinished: boolean,
): boolean => {
  return isFinished || !competition.fog_of_war;
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
    end.setHours(23, 59, 59, 999);
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

export const getDaysUntilStart = (startDate: string): string => {
  const now = new Date();
  const start = new Date(startDate);
  now.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const diffTime = start.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'très bientôt';
  if (diffDays === 1) return 'demain';
  return `dans ${diffDays} jours`;
};

export const getTimeRemaining = (
  endDateStr: string | null | undefined,
): string | null => {
  if (!endDateStr) return null;
  const now = new Date();
  const end = new Date(endDateStr);
  end.setHours(23, 59, 59, 999);

  const diffTime = end.getTime() - now.getTime();
  if (diffTime <= 0) return null;

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 2) return `dans ${diffDays} jours`;
  if (diffDays === 1) return `demain`;
  return `aujourd'hui`;
};

export const getIsUrgent = (endDateStr: string | null | undefined): boolean => {
  if (!endDateStr) return false;
  const now = new Date();
  const end = new Date(endDateStr);
  end.setHours(23, 59, 59, 999);

  const diffTime = end.getTime() - now.getTime();
  const diffHours = diffTime / (1000 * 60 * 60);

  return diffHours > 0 && diffHours < 24;
};
