import { type ReactNode } from 'react';
import { CompetitionContext, useAuthContext } from '@/context';
import { useCompetitionSettings } from '@/hooks';
import { isReferee } from '@/utils';
import type { Competition, EnrichedLeaderboardItem } from '@/types';

interface ProviderProps {
  children: ReactNode;
  competition: Competition;
  leaderboard: EnrichedLeaderboardItem[];
  refresh: () => void;
}

export const CompetitionProvider = ({
  children,
  competition,
  leaderboard,
  refresh,
}: ProviderProps) => {
  const { user } = useAuthContext();

  const isRefereeUser = competition ? isReferee(competition, user) : false;

  const value = useCompetitionSettings({
    competition,
    leaderboard,
    isAdmin: isRefereeUser,
    hidePoints: competition?.fog_of_war && !isRefereeUser,
    refresh,
  });

  return (
    <CompetitionContext.Provider value={value}>
      {children}
    </CompetitionContext.Provider>
  );
};
