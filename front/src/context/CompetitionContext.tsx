import { createContext, useCallback, useMemo, type ReactNode } from 'react';
import { useBonusDays } from '@/hooks/competition/useBonusDays';
import { sortByDate } from '@/utils';

export interface CompetitionContextType {
  competition: any;
  bonusDays: any[];
  isAdmin: boolean;
  hidePoints: boolean;
  refresh: () => void;
  getMultiplier: (date: string | null) => number | undefined;
  getTodayBonus: () => any | undefined;
}

export const CompetitionContext = createContext<
  CompetitionContextType | undefined
>(undefined);

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

  return (
    <CompetitionContext.Provider
      value={{
        competition,
        bonusDays,
        isAdmin,
        hidePoints,
        refresh,
        getMultiplier,
        getTodayBonus,
      }}
    >
      {children}
    </CompetitionContext.Provider>
  );
};
