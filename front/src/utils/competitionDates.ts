import { LOG_MESSAGES } from '@/shared/constants';
import { formatFrenchDate } from '../shared/utils/dateUtils';

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
    console.error(LOG_MESSAGES.UTILS.DATE_PARSING_FAILED, {
      cleanDate,
      timePart,
    });
    return '';
  }

  return localDate.toISOString();
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

export const combineDateTime = (
  date: string,
  time: string | null | undefined,
  isFullDay: boolean,
) => {
  const finalTime = isFullDay || !time ? '00:00' : time;
  return new Date(`${date}T${finalTime}:00`).toISOString();
};
