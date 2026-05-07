import { useNavigate } from 'react-router-dom';
import {
  useAuth,
  useParticipationDelete,
  useLeaderboardLogic,
  type EnrichedLeaderboardItem,
} from '@/hooks';
import { ROUTES } from '@/constants/routes';
import { canManageCompetition } from '@/utils';
import type { Competition, Participation } from '@/types';
import { useMemo } from 'react';

export const useLeaderboardUI = (
  participations: Participation[],
  competition: Competition,
  onRefresh: () => void,
) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = canManageCompetition(competition, user);
  const isFogOfWarActive = competition.fog_of_war && !isAdmin;

  const { deleteParticipation } = useParticipationDelete(onRefresh);

  const enrichedParticipations = useLeaderboardLogic(participations);

  const displayableParticipations = useMemo(() => {
    if (!isFogOfWarActive) return enrichedParticipations;

    return [...enrichedParticipations].sort((participationA, participationB) =>
      (participationA.player.display_name || '').localeCompare(
        participationB.player.display_name || '',
      ),
    );
  }, [enrichedParticipations, isFogOfWarActive]);

  const handleParticipationDelete = async (
    participationToDelete: EnrichedLeaderboardItem,
  ) => {
    const playerName = participationToDelete.player?.display_name;
    const isDeleteSuccessful = await deleteParticipation(
      participationToDelete.id,
      playerName,
      false,
    );

    if (isDeleteSuccessful && participationToDelete.isMe) {
      navigate(ROUTES.NAV.DASHBOARD);
    }
  };

  return {
    dislpayedParticipations: displayableParticipations,
    isFogActive: isFogOfWarActive,
    isAdmin,
    handleDelete: handleParticipationDelete,
  };
};
