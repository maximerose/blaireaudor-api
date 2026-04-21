import { useMemo } from 'react';
import { type Competition } from '../context/AuthContext';

export const useReportDateLimits = (competition: Competition | null) => {
  return useMemo(() => {
    if (!competition) return { minDate: '', maxDate: '' };

    const today = new Date().toISOString().split('T')[0];
    const start = competition.start_date.split('T')[0];
    const end = competition.end_date
      ? competition.end_date.split('T')[0]
      : null;

    if (start > today) {
      return { minDate: start, maxDate: start };
    }

    const minDate = start;
    const maxDate = end && end < today ? end : today;

    return { minDate, maxDate };
  }, [competition]);
};
