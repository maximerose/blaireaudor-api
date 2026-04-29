import { useState } from 'react';
import { apiFetch } from '@/api/config';
import { ROUTES } from '@/constants/routes';

export const useCompetitionReferees = (competitionId: string, onRefresh: () => void) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const addReferee = async (playerId: string) => {
    setLoadingAction(`add-${playerId}`);
    try {
      const res = await apiFetch(ROUTES.API_ADD_REFEREE(competitionId), {
        method: 'POST',
        body: JSON.stringify({ player_id: playerId }),
      });

      if (res.ok) {
        onRefresh();
        return true;
      }
      const data = await res.json();
      alert(data.error || "Erreur lors de l'ajout de l'arbitre.");
    } catch (e) {
      console.error("Erreur réseau", e);
    } finally {
      setLoadingAction(null);
    }
    return false;
  };

  const removeReferee = async (playerId: string) => {
    setLoadingAction(`remove-${playerId}`);
    try {
      const res = await apiFetch(ROUTES.API_REMOVE_REFEREE(competitionId), {
        method: 'POST',
        body: JSON.stringify({ player_id: playerId }),
      });

      if (res.ok) {
        onRefresh();
        return true;
      }

      const data = await res.json();
      alert(data.error || "Erreur lors du retrait de l'arbitre.");
    } catch (e) {
      console.error("Erreur réseau", e);
    } finally {
      setLoadingAction(null);
    }
    return false;
  };

  return { addReferee, removeReferee, loadingAction };
};