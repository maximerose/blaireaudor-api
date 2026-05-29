/**
 * Trie un tableau d'objets par date (ISO string).
 * @param list Le tableau à trier
 * @param key La clé contenant la date (ex: 'date' ou 'date_action')
 * @param order 'asc' ou 'desc'
 */
export const sortByDate = <T>(
  list: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc',
): T[] => {
  return [...list].sort((a, b) => {
    const dateA = new Date(a[key] as string).getTime();
    const dateB = new Date(b[key] as string).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Extrait les composants Date et Time d'une string ISO pour les formulaires.
 */
export const parseFromApiISO = (isoString: string) => {
  if (!isoString) return { date: '', time: '00:00' };
  const d = new Date(isoString);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
};

export const getLocalDayString = (dateInput: string | Date): string => {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const formatCompactDate = (
  dateStr: string | null | undefined,
): string | null => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? null
    : date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
      });
};

/**
 * Convertit une date ISO en indicateur temporel relatif compact (style Facebook/Instagram)
 * Exemple : "5 min", "2 h", "3 j", "1 sem"
 */
export const formatRelativeTime = (dateInput: string | Date): string => {
  if (!dateInput) return '-';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '-';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Moins d'une minute
  if (diffInSeconds < 60) return 'Maintenant';

  // Moins d'une heure
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min`;

  // Moins d'un jour
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} h`;

  // Moins d'une semaine
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} j`;

  // Moins d'un mois (estimé à 30 jours)
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInDays < 30) return `${diffInWeeks} sem`;

  // Moins d'un an
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} mois`;

  // Au-delà d'un an, on réutilise le format court standard (ex: 15 mai)
  return date
    .toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
    .replace('.', '');
};

export const formatFrenchDate = (
  dateStr: string | null | undefined,
): string | null => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? null
    : date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
};

export const formatShortDate = (dateString: string | Date): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  return date
    .toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
    .replace('.', '');
};

/**
 * Formate une date en "Lundi 19 avril"
 */
export const formatLongDate = (dateStr: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(dateStr));
};

export const getDatePart = (iso?: string | null) =>
  iso ? iso.split('T')[0] : '';
export const getTimePart = (iso?: string | null) =>
  iso ? iso.split('T')[1].substring(0, 5) : '00:00';
