import { useAuth, useParticipationDelete } from '@/hooks';
import { canManageCompetition } from '@/utils';
import type { Competition, Participation } from '@/types';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

export const useLeaderboardUI = (
  participations: Participation[],
  competition: Competition,
  onRefresh: () => void,
) => {
  console.log('Je passe dans useLeaderboardUI');

  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = canManageCompetition(competition, user);
  const isFogActive = competition.fog_of_war && !isAdmin;

  const { deleteParticipation } = useParticipationDelete(onRefresh);

  const displayableParticipations = useMemo(() => {
    const enriched = participations.map((p) => ({
      ...p,
      isMe: p.player.id === user?.player?.id,
      isExAequo:
        participations.filter((other) => other.score === p.score).length > 1,
    }));

    if (!isFogActive) return enriched;

    return [...enriched].sort((a, b) =>
      (a.player.display_name || '').localeCompare(b.player.display_name || ''),
    );
  }, [participations, isFogActive, user]);

  const handleDelete = async (p: Participation) => {
    const success = await deleteParticipation(
      p.id,
      p.player.display_name,
      false,
    );
    if (success && p.player.id === user?.player?.id) {
      navigate(ROUTES.NAV.DASHBOARD);
    }
  };

  return {
    dislpayedParticipations: displayableParticipations,
    isFogActive,
    isAdmin,
    handleDelete,
  };
};
