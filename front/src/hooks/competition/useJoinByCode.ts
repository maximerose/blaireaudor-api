import { useState } from 'react';
import { useAuth } from '@/hooks';
import { apiFetch } from '@/api/config';
import { ROUTES } from '@/constants/routes';

export const useJoinByCode = (onSuccess: (code: string) => void) => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinByCode = async (joinCode: string) => {
    if (!joinCode || !user?.player?.id) return;

    setLoading(true);
    setError(null);

    try {
      const checkRes = await apiFetch(ROUTES.API_COMPETITION_BY_CODE(joinCode));

      if (checkRes.status === 404) {
        throw new Error("Cette arène n'existe pas. Vérifie ton code !");
      }

      const competition = await checkRes.json();

      const joinRes = await apiFetch(ROUTES.API_PARTICIPATIONS, {
        method: 'POST',
        body: JSON.stringify({
          player: ROUTES.IRI_PLAYER(user?.player?.id),
          competition: ROUTES.IRI_COMPETITION(competition.id),
        }),
      });

      if (!joinRes.ok) {
        const errorData = await joinRes.json();
        const violation = errorData.violations?.[0]?.message;

        switch (violation) {
          case 'ALREADY_JOINED':
            throw new Error('Tu es déjà dans le tournoi !');
          case 'COMPETITION_FINISHED':
            throw new Error('Trop tard, ce tournoi est terminé.');
          default:
            throw new Error('Impossible de rejoindre cette compétition.');
        }
      }

      await refreshUser();
      onSuccess(joinCode);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { joinByCode, loading, error };
};
