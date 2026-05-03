import { useMemo } from 'react';
import {
  CompetitionStatus,
  getCompetitionStatus,
  getStatusWeight,
} from '@/utils';
import type { Participation } from '@/types';

export const useDashboardSort = (participations: Participation[]) => {
  return useMemo(() => {
    return [...participations].sort((a, b) => {
      const statusA = getCompetitionStatus(
        a.competition.start_date,
        a.competition.end_date,
      );
      const statusB = getCompetitionStatus(
        b.competition.start_date,
        b.competition.end_date,
      );
      const weightA = getStatusWeight(statusA);
      const weightB = getStatusWeight(statusB);

      if (weightA !== weightB) return weightA - weightB;

      const dateA = new Date(
        a.competition.end_date ?? a.competition.start_date,
      ).getTime();
      const dateB = new Date(
        b.competition.end_date ?? b.competition.start_date,
      ).getTime();

      if (statusA === CompetitionStatus.FINISHED) return dateB - dateA;

      return dateA - dateB;
    });
  }, [participations]);
};
