import { useMemo, type ReactNode } from 'react';
import {
  CompetitionContext,
  isReferee,
  useCompetitionSettings,
  type Competition,
  type EnrichedLeaderboardItem,
  type Participation,
} from '@/features/competition';
import { useAuthContext } from '@/features/account';

interface ProviderProps {
  children: ReactNode;
  competition: Competition;
  leaderboard: Participation[];
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
