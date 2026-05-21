import { useNavigate } from 'react-router-dom';
import { competitionService } from '@/services';
import { CONFIRMS, ERRORS, ROUTES, SUCCESS, useConfirmModal } from '@/shared';
import toast from 'react-hot-toast';
import { useAuthContext } from '@/features/account';

export const useCompetitionDelete = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuthContext();
  const { openModal, closeModal } = useConfirmModal();

  const deleteCompetition = (id: string, name: string, hasActions: boolean) => {
    if (hasActions) {
      toast.error(ERRORS.COMPETITION.DELETE_HAS_ACTIONS(name));
      return;
    }

    openModal({
      title: CONFIRMS.COMPETITION.DELETE_TITLE,
      message: CONFIRMS.COMPETITION.DELETE_MESSAGE(name),
      onConfirm: async () => {
        try {
          const success = await competitionService.delete(id);
          if (success) {
            toast.success(SUCCESS.COMPETITION.DELETED);
            navigate(ROUTES.NAV.DASHBOARD);
            await refreshUser();
            closeModal();
          }
        } catch {
          closeModal();
          toast.error(ERRORS.COMPETITION.DELETE_FAILED);
        }
      },
    });
  };

  return { deleteCompetition };
};
