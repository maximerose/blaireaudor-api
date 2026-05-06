import { useAuth } from '@/hooks';
import { ERRORS } from '@/constants';
import { competitionService } from '@/services/api/competition';

export const useParticipationDelete = (onSuccess: () => void) => {
  const { refreshUser } = useAuth();

  const deleteParticipation = async (
    participationId: string,
    playerName: string,
    hasActions: boolean,
  ): Promise<boolean> => {
    if (hasActions) {
      alert(
        `Impossible de retirer ${playerName} : Il a déjà des actions enregistrées dans cette compétition.`,
      );
      return false;
    }

    if (!window.confirm(`Retirer ${playerName} de cette compétition ?`))
      return false;

    try {
      await competitionService.removeParticipation(participationId);
      await refreshUser();
      onSuccess();
      return true;
    } catch (error) {
      console.error(ERRORS.COMPETITION.PARTICIPATION_REMOVE_FAILED, error);
      return false;
    }
  };

  return { deleteParticipation };
};
