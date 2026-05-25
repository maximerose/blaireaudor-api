import {
  CONFIRMS,
  ERRORS,
  ROUTES,
  SUCCESS,
  useConfirmModal,
  handleApiError,
} from '@/shared';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/features/account';
import type { Participation } from '@/features/competition/types';
import { competitionService } from '@/features/competition/services';

export const useParticipationDelete = (
  onSuccess: () => void | Promise<void>,
) => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuthContext();
  const { openModal, closeModal } = useConfirmModal();

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
            await onSuccess();

            closeModal();
            toast.success(SUCCESS.COMPETITION.PARTICIPANTS_UPDATED);

            if (participation.player.id === user?.player?.id) {
              navigate(ROUTES.NAV.DASHBOARD);
            }

            refreshUser();
          }
        } catch (e) {
          closeModal();
          handleApiError(
            e,
            undefined,
            ERRORS.COMPETITION.PARTICIPATION_REMOVE_FAILED,
          );
        }
      },
    });
  };

  return { deleteParticipation };
};
