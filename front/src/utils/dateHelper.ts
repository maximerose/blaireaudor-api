/**
 * Transforme les composants d'une date locale en chaîne ISO UTC pour l'API.
 * Gère les secondes pour les fins de journée (23:59:59).
 */
export const formatToApiISO = (date: string, time: string, isFullDay: boolean, isEndDate: boolean): string => {
  if (!date) return '';

  const cleanDate = date.includes('T') ? date.split('T')[0] : date;

  let timePart = isFullDay
    ? (isEndDate ? '23:59' : '00:00')
    : (time || '00:00');

  const localDate = new Date(`${cleanDate}T${timePart}`);

  if (isNaN(localDate.getTime())) {
    console.error(`[dateHelper] Échec du parsing :`, { cleanDate, timePart });
    return '';
  }

  if (isEndDate && isFullDay) {
    localDate.setSeconds(59);
  }

  return localDate.toISOString();
};

/**
 * Trie un tableau d'objets par date (ISO string).
 * @param list Le tableau à trier
 * @param key La clé contenant la date (ex: 'date' ou 'date_action')
 * @param order 'asc' ou 'desc'
 */
export const sortByDate = <T>(list: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
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
    time: `${hours}:${minutes}`
  };
};