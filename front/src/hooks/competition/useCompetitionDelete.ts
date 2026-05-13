import { useNavigate } from 'react-router-dom';
import { useAuth, useConfirmModal } from '@/hooks';
import { competitionService } from '@/services/api/competitionService';
import { ROUTES } from '@/constants/routes';
import toast from 'react-hot-toast';
import { CONFIRMS, ERRORS } from '@/constants';

export const useCompetitionDelete = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { isOpen, config, open, close, confirm } = useConfirmModal();

  const deleteCompetition = (id: string, name: string, actionCount: number) => {
    if (actionCount > 0) {
      toast.error(ERRORS.COMPETITION.DELETE_HAS_ACTIONS(name));
      return;
    }

    const modalConfig = {
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
    };
    open(modalConfig);
  };

  return { deleteCompetition, modal: { isOpen, config, close, confirm } };
};
