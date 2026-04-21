import { apiFetch } from '../api/config';
import { ROUTES } from '../constants/routes';
import { useAuth } from './useAuth';

export const useParticipationDelete = (onSuccess: () => void) => {
  const { refreshUser } = useAuth();

  const deleteParticipation = async (
    participatoinId: string,
    playerName: string,
    hasActions: boolean,
  ) => {
    if (hasActions) {
      alert(
        `Impossible de retirer ${playerName} : Il a déjà des actions enregistrées dans cette compétition.`,
      );
      return;
    }

    if (!window.confirm(`Retirer ${playerName} de cette compétition ?`)) return;

    try {
      const response = await apiFetch(
        ROUTES.API_PARTICIPATION_DETAIL(participatoinId),
        {
          method: 'DELETE',
        },
      );

      if (response.ok) {
        await refreshUser();
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du joueur', error);
    }
  };

  return { deleteParticipation };
};
