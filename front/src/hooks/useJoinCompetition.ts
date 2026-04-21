import { useState } from 'react';
import { useAuth } from './useAuth';
import { apiFetch } from '../api/config';
import { ROUTES } from '../constants/routes';

export const useJoinCompetition = (onSuccess: (code: string) => void) => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinByCode = async (joinCode: string) => {
    if (!joinCode || !user?.player?.id) return;

    setLoading(true);
    setError(null);

    try {
      const checkRes = await apiFetch(
        ROUTES.API_COMPETITION_GET_BY_CODE(joinCode),
      );

      if (!checkRes.ok) {
        throw new Error('Code invalide ou arène introuvable');
      }

      const competition = await checkRes.json();

      const joinRes = await apiFetch(ROUTES.PARTICIPATIONS, {
        method: 'POST',
        body: JSON.stringify({
          player: ROUTES.API_GET_PLAYER(user?.player?.id),
          competition: ROUTES.API_GET_COMPETITION(competition.id),
        }),
      });

      if (!joinRes.ok) {
        const errorData = await joinRes.json();
        throw new Error(
          errorData['hydra:description'] || "Erreur lors de l'inscription",
        );
      }

      await refreshUser();
      onSuccess(joinCode);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { joinByCode, loading, error };
};
