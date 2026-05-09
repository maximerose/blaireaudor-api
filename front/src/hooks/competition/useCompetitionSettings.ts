import { useMemo, useCallback } from 'react';
import { getLocalDayString, sortByDate } from '@/utils';
import type { Competition, BonusDay } from '@/types';
import type { CompetitionContextType } from '@/context/contextTypes';

interface UseCompetitionProps {
  competition: Competition;
  isAdmin: boolean;
  hidePoints: boolean;
  refresh: () => void;
}

export const useCompetitionSettings = ({
  competition,
  isAdmin,
  hidePoints,
  refresh,
}: UseCompetitionProps): CompetitionContextType => {
  const bonusDays = useMemo(
    () => sortByDate(competition.bonus_days || [], 'date'),
    [competition.bonus_days],
  );

  const getMultiplier = useCallback(
    (date: string | null) => {
      if (!date) return undefined;

      const targetDay = getLocalDayString(date);

      return bonusDays.find(
        (bd: BonusDay) => getLocalDayString(bd.date) === targetDay,
      )?.multiplier;
    },
    [bonusDays],
  );

  const getTodayBonus = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return bonusDays.find((bd: BonusDay) => bd.date.split('T')[0] === today);
  }, [bonusDays]);

  return {
    competition,
    bonusDays,
    isAdmin,
    hidePoints,
    refresh,
    getMultiplier,
    getTodayBonus,
  };
};
