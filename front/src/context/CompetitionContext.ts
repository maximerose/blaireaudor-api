import { createContext, useContext } from 'react';
import type { CompetitionContextType } from '@/context/contextTypes';
import { ERRORS } from '@/constants';

export const CompetitionContext = createContext<
  CompetitionContextType | undefined
>(undefined);

export const useCompetition = () => {
  const context = useContext(CompetitionContext);
  if (context === undefined) {
    throw new Error(
      ERRORS.DEVELOPER.HOOK_OUTSIDE_PROVIDER(
        'useCompetition',
        'CompetitionProvider',
      ),
    );
  }
  return context;
};
