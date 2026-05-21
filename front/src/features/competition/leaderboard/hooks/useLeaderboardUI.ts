import {
  useCompetitionContext,
  useParticipationDelete,
  type Participation,
} from '@/features/competition';
import { useAuthContext } from '@/features/account';
import { useMemo } from 'react';

export const useLeaderboardUI = () => {
  const { user } = useAuthContext();

  const { competition, leaderboard, refresh, isAdmin, hidePoints } =
    useCompetitionContext();

  const { deleteParticipation } = useParticipationDelete(refresh);

  const displayableParticipations = useMemo(() => {
    const safeLeaderboard = leaderboard || [];
    const enriched = safeLeaderboard.map((p) => ({
      ...p,
      isMe: p.player.id === user?.player?.id,
      isExAequo:
        safeLeaderboard.filter((other) => other.score === p.score).length > 1,
    }));

    if (!hidePoints) return enriched;

    return [...enriched].sort((a, b) =>
      (a.player.display_name || '').localeCompare(b.player.display_name || ''),
    );
  }, [leaderboard, hidePoints, user]);

  const handleDelete = (p: Participation) => {
    deleteParticipation(p);
  };

  return {
    dislpayedParticipations: displayableParticipations,
    isFogActive: hidePoints,
    isAdmin,
    competition,
    handleDelete,
  };
};
