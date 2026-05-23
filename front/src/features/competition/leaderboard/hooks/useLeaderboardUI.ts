import { useAuthContext } from '@/features/account';
import { useMemo } from 'react';
import { useCompetitionContext } from '@/features/competition/context';
import { useParticipationDelete } from '@/features/competition/admin';
import type { Participation } from '@/features/competition/types';
import { normalizeString } from '@/shared';

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
      normalizeString(a.player.display_name || '').localeCompare(
        normalizeString(b.player.display_name || ''),
        'fr',
      ),
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
