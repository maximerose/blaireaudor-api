import { useState } from 'react';
import { competitionService } from '@/services/api/competitionService';

export const useCompetitionReferees = (
  competitionId: string,
  onRefresh: () => void,
) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const addReferee = async (playerId: string) => {
    setLoadingAction(`add-${playerId}`);
    try {
      const res = await competitionService.addReferee(competitionId, playerId);

      if (res.ok) {
        onRefresh();
        return true;
      }

      const data = await res.json();
      alert(data.error || "Erreur lors de l'ajout de l'arbitre.");
    } catch (e) {
      console.error('Erreur réseau', e);
    } finally {
      setLoadingAction(null);
    }
    return false;
  };

  const removeReferee = async (playerId: string) => {
    setLoadingAction(`remove-${playerId}`);
    try {
      const res = await competitionService.removeReferee(
        competitionId,
        playerId,
      );

      if (res.ok) {
        onRefresh();
        return true;
      }

      const data = await res.json();
      alert(data.error || "Erreur lors du retrait de l'arbitre.");
    } catch (e) {
      console.error('Erreur réseau', e);
    } finally {
      setLoadingAction(null);
    }
    return false;
  };

  return { addReferee, removeReferee, loadingAction };
};
