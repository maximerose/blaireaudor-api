import { useAuth, useConfirmModal } from '@/hooks';
import { ERRORS, ROUTES } from '@/constants';
import { competitionService } from '@/services/api/competitionService';
import toast from 'react-hot-toast';
import type { Participation } from '@/types';
import { useNavigate } from 'react-router-dom';

export const useParticipationDelete = (onSuccess: () => void) => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { isOpen, config, open, close, confirm } = useConfirmModal();

  const deleteParticipation = (participation: Participation) => {
    if (participation.has_actions) {
      toast.error(
        `Impossible de retirer ${participation.player?.display_name} : Il a déjà des actions enregistrées dans cette compétition.`,
      );
      return;
    }

    const modalConfig = {
      title: 'Retirer un joueur',
      message: `Retirer ${participation.player?.display_name} de cette compétition ?`,
      onConfirm: async () => {
        try {
          const success = await competitionService.removeParticipation(
            participation.id,
          );
          if (success) {
            await refreshUser();
            if (success && participation.player.id === user?.player?.id) {
              navigate(ROUTES.NAV.DASHBOARD);
            }
            onSuccess();
          }
        } catch {
          toast.error(ERRORS.COMPETITION.PARTICIPATION_REMOVE_FAILED);
        }
      },
    };

    open(modalConfig);
  };

  return { deleteParticipation, modal: { isOpen, config, close, confirm } };
};
