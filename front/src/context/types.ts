import type { Competition, BonusDay } from '@/types';

export interface CompetitionContextType {
  competition: Competition;
  bonusDays: BonusDay[];
  isAdmin: boolean;
  hidePoints: boolean;
  refresh: () => void;
  getMultiplier: (date: string | null) => number | undefined;
  getTodayBonus: () => BonusDay | undefined;
}
