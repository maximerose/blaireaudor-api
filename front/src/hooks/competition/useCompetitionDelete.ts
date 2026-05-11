import { useNavigate } from 'react-router-dom';
import { useAuth, useConfirmModal } from '@/hooks';
import { competitionService } from '@/services/api/competitionService';
import { ROUTES } from '@/constants/routes';
import toast from 'react-hot-toast';

export const useCompetitionDelete = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { isOpen, config, open, close, confirm } = useConfirmModal();

  const deleteCompetition = (id: string, name: string, actionCount: number) => {
    if (actionCount > 0) {
      toast.error(
        `Impossible de supprimer "${name}" car elle contient des actions.`,
      );
      return;
    }

    const modalConfig = {
      title: 'Supprimer la compétition',
      message: `Supprimer définitivement "${name}" ?`,
      onConfirm: async () => {
        try {
          const success = await competitionService.delete(id);
          if (success) {
            await refreshUser();
            navigate(ROUTES.NAV.DASHBOARD);
          }
        } catch {
          toast.error('Erreur lors de la suppression.');
        }
      },
    };
    open(modalConfig);
  };

  return { deleteCompetition, modal: { isOpen, config, close, confirm } };
};
