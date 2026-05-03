import { useCallback, useMemo, useContext, type ReactNode } from 'react';
import { useBonusDays } from '@/hooks';
import { sortByDate } from '@/utils';
import {
  CompetitionContext,
  type CompetitionContextType,
} from './CompetitionContext';

export const CompetitionProvider = ({
  children,
  competition,
  isAdmin,
  hidePoints,
  refresh,
}: {
  children: ReactNode;
  competition: any;
  isAdmin: boolean;
  hidePoints: boolean;
  refresh: () => void;
}) => {
  const { data: rawBonusDays } = useBonusDays(competition.id);

  const bonusDays = useMemo(
    () => sortByDate(rawBonusDays || [], 'date'),
    [rawBonusDays],
  );

  const getMultiplier = useCallback(
    (date: string | null): number | undefined => {
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

export const useCompetition = () => {
  const context = useContext(CompetitionContext);
  if (context === undefined) {
    throw new Error('useCompetition must be used within a CompetitionProvider');
  }
  return context;
};
