import { useContext } from 'react';
import {
  CompetitionContext,
  type CompetitionContextType,
} from '@/context/CompetitionContext';

export const useCompetition = (): CompetitionContextType => {
  const context = useContext(CompetitionContext);
  if (!context) {
    throw new Error(
      'useCompetition doit être utilisé dans un CompetitionProvider',
    );
  }
  return context;
};
