import { type ReactNode } from 'react';
import { CompetitionContext } from './CompetitionContext';
import { useAuth, useCompetitionData, useCompetitionSettings } from '@/hooks';
import { isReferee } from '@/utils';

interface ProviderProps {
  children: ReactNode;
  code: string;
}

export const CompetitionProvider = ({ children, code }: ProviderProps) => {
  const { competition, leaderboard, refresh, isReady } =
    useCompetitionData(code);
  const { user } = useAuth();

  const isRefereeUser = competition ? isReferee(competition, user) : false;

  const value = useCompetitionSettings({
    competition,
    leaderboard,
    isAdmin: isRefereeUser,
    hidePoints: competition?.fog_of_war && !isRefereeUser,
    refresh,
  });

  if (!isReady || !competition) return null;

  return (
    <CompetitionContext.Provider value={value}>
      {children}
    </CompetitionContext.Provider>
  );
};
