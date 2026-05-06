import { useMemo } from 'react';

export const useCompetitionDateLimits = (
  competition: any,
  capAtToday: boolean = false,
) => {
  return useMemo(() => {
    if (!competition) return { minDate: '', maxDate: '' };

    const toLocalYYYYMMDD = (dateStr: string | Date) => {
      const d = new Date(dateStr);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const start = toLocalYYYYMMDD(competition.start_date);
    const end = competition.end_date
      ? toLocalYYYYMMDD(competition.end_date)
      : null;
    const today = toLocalYYYYMMDD(new Date());

    const limitEnd = capAtToday ? (end && end < today ? end : today) : end;

    return {
      minDate: start,
      maxDate: limitEnd || '',
    };
  }, [competition, capAtToday]);
};
