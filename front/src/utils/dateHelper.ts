/**
 * Transforme les composants d'une date locale en chaîne ISO UTC pour l'API.
 * Gère les secondes pour les fins de journée (23:59:59).
 */
export const formatToApiISO = (
  date: string,
  time?: string,
  isFullDay: boolean = false,
  isEndDate: boolean = false,
): string => {
  if (!date) return '';

  const cleanDate = date.includes('T') ? date.split('T')[0] : date;

  let timePart: string;

  if (isFullDay) {
    // Pour les limites de compétition (00:00 ou 23:59:59)
    timePart = isEndDate ? '23:59:59' : '00:00:00';
  } else if (time) {
    // Si une heure est spécifiée (ex: '14:30')
    timePart = time.length === 5 ? `${time}:00` : time;
  } else {
    // LOGIQUE : Si pas d'heure, on prend l'heure actuelle locale
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    timePart = `${h}:${m}:${s}`;
  }

  const localDate = new Date(`${cleanDate}T${timePart}`);

  if (isNaN(localDate.getTime())) {
    console.error(`[dateHelper] Échec du parsing :`, { cleanDate, timePart });
    return '';
  }

  return localDate.toISOString();
};

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

export const getDisplayDateText = (
  startDateStr: string | null | undefined,
  endDateStr?: string | null,
) => {
  if (!startDateStr) return 'Date inconnue';
  const start = formatFrenchDate(startDateStr);
  const end = formatFrenchDate(endDateStr);
  if (start && end) return `Du ${start} au ${end}`;
  return start
    ? new Date(startDateStr) < new Date()
      ? `Débuté le ${start}`
      : `Débutera le ${start}`
    : 'Date inconnue';
};
