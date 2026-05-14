import { useNavigate } from 'react-router-dom';
import { competitionService } from '@/services';
import { CONFIRMS, ERRORS, ROUTES } from '@/constants';
import toast from 'react-hot-toast';
import { useAuthContext, useConfirmModal } from '@/context';

export const useCompetitionDelete = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuthContext();
  const { openModal } = useConfirmModal();

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
            await refreshUser();
            navigate(ROUTES.NAV.DASHBOARD);
          }
        } catch {
          toast.error(ERRORS.COMPETITION.DELETE_FAILED);
        }
      },
    });
  };

  return { deleteCompetition };
};
