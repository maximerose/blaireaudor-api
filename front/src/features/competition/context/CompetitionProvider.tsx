import { useMemo, type ReactNode } from 'react';
import { useAuthContext } from '@/features/account/context/AuthContext';
import type {
  Competition,
  EnrichedLeaderboardItem,
  Participation,
} from '@/features/competition/types';
import { isReferee } from '@/features/competition/utils';
import { useCompetitionSettings } from '@/features/competition/admin';
import { CompetitionContext } from './CompetitionContext';

interface ProviderProps {
  children: ReactNode;
  competition: Competition;
  leaderboard: Participation[];
  refresh: () => Promise<void>;
}

export const CompetitionProvider = ({
  children,
  competition,
  leaderboard,
  refresh,
}: ProviderProps) => {
  const { user } = useAuthContext();

  const isRefereeUser = competition ? isReferee(competition, user) : false;

  const enrichedLeaderboard = useMemo<EnrichedLeaderboardItem[]>(() => {
    return leaderboard.map((p) => ({
      ...p,
      isMe: p.player?.id === user?.player?.id,
      isExAequo:
        leaderboard.filter((other) => other.score === p.score).length > 1,
    }));
  }, [leaderboard, user]);

  const value = useCompetitionSettings({
    competition,
    leaderboard: enrichedLeaderboard,
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
