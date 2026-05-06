import { type ReactNode } from 'react';
import { CompetitionContext } from './CompetitionContext';
import { useCompetitionSettings } from '@/hooks';
import type { Competition } from '@/types';

interface ProviderProps {
  children: ReactNode;
  competition: Competition;
  isAdmin: boolean;
  hidePoints: boolean;
  refresh: () => void;
}

export const CompetitionProvider = ({ children, ...props }: ProviderProps) => {
  const value = useCompetitionSettings(props);

  return (
    <CompetitionContext.Provider value={value}>
      {children}
    </CompetitionContext.Provider>
  );
};
