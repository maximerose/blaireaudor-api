import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { competitionService } from '@/services/api/competitionService';
import { ROUTES } from '@/constants/routes';
import toast from 'react-hot-toast';
import { CONFIRMS, ERRORS } from '@/constants';
import { useConfirmModal } from '@/context/ConfirmModalContext';

export const useCompetitionDelete = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
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
