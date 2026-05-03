import { useCallback, useMemo, type ReactNode } from 'react';
import { sortByDate } from '@/utils';
import { CompetitionContext } from './CompetitionContext';
import type { Competition } from '@/types';
import type { CompetitionContextType } from '@/context/types';

export const CompetitionProvider = ({
  children,
  competition,
  isAdmin,
  hidePoints,
  refresh,
}: {
  children: ReactNode;
  competition: Competition;
  isAdmin: boolean;
  hidePoints: boolean;
  refresh: () => void;
}) => {
  const bonusDays = useMemo(
    () => sortByDate(competition.bonus_days || [], 'date'),
    [competition.bonus_days],
  );

  const getMultiplier = useCallback(
    (date: string | null) => {
      if (!date) return undefined;
      const cleanDate = date.split('T')[0];
      return bonusDays.find((bd) => bd.date.split('T')[0] === cleanDate)
        ?.multiplier;
    },
    [bonusDays],
  );

  const getTodayBonus = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return bonusDays.find((bd) => bd.date.split('T')[0] === today);
  }, [bonusDays]);

  const value: CompetitionContextType = useMemo(
    () => ({
      competition,
      bonusDays,
      isAdmin,
      hidePoints,
      refresh,
      getMultiplier,
      getTodayBonus,
    }),
    [
      competition,
      bonusDays,
      isAdmin,
      hidePoints,
      refresh,
      getMultiplier,
      getTodayBonus,
    ],
  );

  return (
    <CompetitionContext.Provider value={value}>
      {children}
    </CompetitionContext.Provider>
  );
};
