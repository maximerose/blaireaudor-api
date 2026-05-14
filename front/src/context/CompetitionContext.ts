import { createContext, useContext } from 'react';
import type { CompetitionContextType } from '@/context';
import { ERRORS } from '@/constants';

export const CompetitionContext = createContext<
  CompetitionContextType | undefined
>(undefined);

export const useCompetitionContext = () => {
  const context = useContext(CompetitionContext);
  if (context === undefined) {
    throw new Error(
      ERRORS.DEVELOPER.HOOK_OUTSIDE_PROVIDER(
        'useCompetitionContext',
        'CompetitionProvider',
      ),
    );
  }
  return context;
};
