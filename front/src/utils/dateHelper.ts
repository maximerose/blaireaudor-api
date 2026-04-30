/**
 * Transforme les composants d'une date locale en chaîne ISO UTC pour l'API.
 * Gère les secondes pour les fins de journée (23:59:59).
 */
export const formatToApiISO = (date: string, time: string, isFullDay: boolean, isEndDate: boolean): string => {
  if (!date) return '';

  let timePart = isFullDay ? (isEndDate ? '23:59' : '00:00') : time;

  const localDate = new Date(`${date}T${timePart}`);

  if (isEndDate && isFullDay) {
    localDate.setSeconds(59);
  }

  return localDate.toISOString();
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