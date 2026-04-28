import { useNavigate } from 'react-router-dom';
import { useAuth, useParticipationDelete, useLeaderboardLogic } from '@/hooks';
import { ROUTES } from '@/constants/routes';
import { canManageCompetition } from '@/utils';

export const useLeaderboardUI = (
  data: any[],
  competition: any,
  onRefresh: () => void,
) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = canManageCompetition(competition, user);
  const { deleteParticipation } = useParticipationDelete(onRefresh);
  const enrichedData = useLeaderboardLogic(data, user);

  const handleDelete = async (item: any) => {
    const playerName = item.player?.display_name || item.player?.displayName;
    const success = await deleteParticipation(item.id, playerName, false);

    if (success && item.isMe) {
      navigate(ROUTES.NAV_DASHBOARD);
    }
  };

  return {
    enrichedData,
    isAdmin,
    handleDelete,
  };
};
