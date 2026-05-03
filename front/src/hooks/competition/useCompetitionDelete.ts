import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { competitionService } from '@/services/api/competition';
import { ROUTES } from '@/constants/routes';

export const useCompetitionDelete = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const deleteCompetition = async (
    id: string,
    name: string,
    actionCount: number,
  ) => {
    if (actionCount > 0) {
      alert(`Impossible de supprimer "${name}" car elle contient des actions.`);
      return false;
    }

    if (!window.confirm(`Supprimer définitivement "${name}" ?`)) return false;

    try {
      const success = await competitionService.delete(id);

      if (success) {
        await refreshUser();
        navigate(ROUTES.NAV.DASHBOARD);
        return true;
      }
    } catch (error) {
      console.error('Erreur technique lors de la suppression', error);
    }

    return false;
  };

  return { deleteCompetition };
};
