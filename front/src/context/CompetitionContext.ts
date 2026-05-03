import { createContext, useContext } from 'react';
import type { CompetitionContextType } from '@/context/types';

export const CompetitionContext = createContext<
  CompetitionContextType | undefined
>(undefined);

export const useCompetition = () => {
  const context = useContext(CompetitionContext);
  if (context === undefined) {
    throw new Error('useCompetition must be used within a CompetitionProvider');
  }
  return context;
};
