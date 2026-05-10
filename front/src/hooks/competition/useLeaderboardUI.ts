import { useAuth, useCompetition, useParticipationDelete } from '@/hooks';
import type { Participation } from '@/types';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

export const useLeaderboardUI = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { competition, leaderboard, refresh, isAdmin, hidePoints } =
    useCompetition();

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

  const handleDelete = async (p: Participation) => {
    const success = await deleteParticipation(
      p.id,
      p.player.display_name,
      false, // TODO: à lier plus tard à p.hasActions si tu l'ajoutes au type
    );

    if (success && p.player.id === user?.player?.id) {
      navigate(ROUTES.NAV.DASHBOARD);
    }
  };

  return {
    dislpayedParticipations: displayableParticipations,
    isFogActive: hidePoints,
    isAdmin,
    competition,
    handleDelete,
  };
};
