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
