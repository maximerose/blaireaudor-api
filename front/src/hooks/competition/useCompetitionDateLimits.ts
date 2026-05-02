import { useMemo } from 'react';

export const useCompetitionDateLimits = (
  competition: any,
  capAtToday: boolean = false,
) => {
  return useMemo(() => {
    if (!competition) return { minDate: '', maxDate: '' };

    const start = competition.start_date.split('T')[0];
    const end = competition.end_date
      ? competition.end_date.split('T')[0]
      : null;
    const today = new Date().toISOString().split('T')[0];

    const limitEnd = capAtToday ? (end && end < today ? end : today) : end;

    return {
      minDate: start,
      maxDate: limitEnd || '',
    };
  }, [competition, capAtToday]);
};
