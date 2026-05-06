import { useContext } from 'react';
import { CompetitionContext } from '@/context/CompetitionContext';
import { ERRORS } from '@/constants';
import type { CompetitionContextType } from '@/context/contextTypes';

export const useCompetition = (): CompetitionContextType => {
  const context = useContext(CompetitionContext);
  if (!context) {
    throw new Error(
      ERRORS.DEVELOPER.HOOK_OUTSIDE_PROVIDER(
        'useCompetition',
        'CompetitionProvider',
      ),
    );
  }
  return context;
};
