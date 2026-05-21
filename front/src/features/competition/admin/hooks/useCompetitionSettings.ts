import { useMemo, useCallback } from 'react';
import { getLocalDayString, sortByDate } from '@/shared';
import type {
  Competition,
  BonusDay,
  EnrichedLeaderboardItem,
  CompetitionContextType,
} from '@/features/competition';

interface UseCompetitionProps {
  competition: Competition;
  leaderboard: EnrichedLeaderboardItem[];
  isAdmin: boolean;
  hidePoints: boolean;
  refresh: () => void;
}

export const useCompetitionSettings = ({
  competition,
  leaderboard,
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
    const today = getLocalDayString(new Date());

    return bonusDays.find(
      (bd: BonusDay) => getLocalDayString(bd.date) === today,
    );
  }, [bonusDays]);

  return {
    competition,
    leaderboard,
    bonusDays,
    isAdmin,
    hidePoints,
    refresh,
    getMultiplier,
    getTodayBonus,
  };
};
