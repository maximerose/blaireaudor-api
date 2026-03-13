import { type Competition } from '../context/AuthContext';

export const CompetitionStatus = {
  ACTIVE: 'ACTIVE',
  UPCOMING: 'UPCOMING',
  FINISHED: 'FINISHED',
} as const;

export type CompetitionStatusType = typeof CompetitionStatus[keyof typeof CompetitionStatus];

/**
 * Formate une date en français (ex: 12 mars 2026)
 */
export const formatFrenchDate = (dateStr: string | null | undefined): string | null => {
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
 * Détermine si une compétition est terminée
 */
export const getIsFinished = (endDateStr: string | null | undefined): boolean => {
  if (!endDateStr) return false;
  const endDate = new Date(endDateStr);
  return !isNaN(endDate.getTime()) && endDate < new Date();
};

/**
 * Génère le libellé de la période de compétition
 */
export const getDisplayDateText = (startDateStr: string, endDateStr?: string | null) => {
  const formattedStart = formatFrenchDate(startDateStr);
  const formattedEnd = formatFrenchDate(endDateStr);

  if (formattedStart && formattedEnd) {
    return `Du ${formattedStart} au ${formattedEnd}`;
  } else if (formattedStart && new Date(startDateStr) < new Date()) {
    return `Débuté le ${formattedStart}`;
  } else if (formattedStart) {
    return `Débutera le ${formattedStart}`;
  }
  return "Date inconnue";
};

/**
 * Détermine si les scores doivent être révélés
 */
export const canRevealScores = (competition: Competition, isFinished: boolean): boolean => {
  return isFinished || !competition.fog_of_war;
};

export const getCompetitionStatus = (startDateStr: string, endDateStr: string | null): CompetitionStatusType => {
  const now = new Date();
  const start = new Date(startDateStr);
  const end = endDateStr ? new Date(endDateStr) : null;

  if (now < start) return CompetitionStatus.UPCOMING;
  if (end && now > end) return CompetitionStatus.FINISHED;
  return CompetitionStatus.ACTIVE;
};

export const getStatusWeight = (status: CompetitionStatusType): number => {
  switch (status) {
    case CompetitionStatus.ACTIVE: return 1;
    case CompetitionStatus.UPCOMING: return 2;
    case CompetitionStatus.FINISHED: return 3;
  }
}
