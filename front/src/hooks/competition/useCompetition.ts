import { useContext } from 'react';
import {
  CompetitionContext,
  type CompetitionContextType,
} from '@/context/CompetitionContext';
import { ERRORS } from '@/constants';

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
