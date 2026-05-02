import { createContext } from 'react';

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
