import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { apiFetch } from '../api/config';
import { ROUTES } from '../constants/routes';

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
      const response = await apiFetch(ROUTES.API_COMPETITION_DELETE(id), {
        method: 'DELETE',
      });

      if (response.ok) {
        await refreshUser();
        navigate(ROUTES.DASHBOARD);
        return true;
      }
    } catch (error) {
      console.error('Erreur technique lors de la suppression', error);
    }

    return false;
  };

  return { deleteCompetition };
};
