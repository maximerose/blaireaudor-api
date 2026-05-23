import { CONFIRMS, ERRORS, ROUTES, useConfirmModal } from '@/shared';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/features/account';
import type { Participation } from '@/features/competition/types';
import { competitionService } from '@/features/competition/services';

export const useParticipationDelete = (onSuccess: () => void) => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuthContext();
  const { openModal } = useConfirmModal();

  const deleteParticipation = (participation: Participation) => {
    if (participation.has_actions) {
      toast.error(
        ERRORS.COMPETITION.PARTICIPATION_HAS_ACTIONS(
          participation.player?.display_name,
        ),
      );
      return;
    }

    openModal({
      title: CONFIRMS.PARTICIPATION.REMOVE_TITLE,
      message: CONFIRMS.PARTICIPATION.REMOVE_MESSAGE(
        participation.player?.display_name,
      ),
      onConfirm: async () => {
        try {
          const success = await competitionService.removeParticipation(
            participation.id,
          );
          if (success) {
            onSuccess();
            if (success && participation.player.id === user?.player?.id) {
              navigate(ROUTES.NAV.DASHBOARD);
            }

            refreshUser();
          }
        } catch {
          toast.error(ERRORS.COMPETITION.PARTICIPATION_REMOVE_FAILED);
        }
      },
    });
  };

  return { deleteParticipation };
};
