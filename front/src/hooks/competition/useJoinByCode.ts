import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks';
import { apiFetch } from '@/services/api/config';
import { ROUTES } from '@/constants/routes';

export const useJoinByCode = (onSuccess: (code: string) => void) => {
  const { user, refreshUser } = useAuth();

  const mutation = useMutation({
    mutationFn: async (joinCode: string) => {
      const playerId = user?.player?.id;

      if (!playerId) {
        throw new Error('Action impossible : profil joueur introuvable.');
      }

      const checkRes = await apiFetch(
        ROUTES.API.COMPETITIONS.BY_CODE(joinCode),
      );
      if (checkRes.status === 404) throw new Error("Cette arène n'existe pas.");

      const competition = await checkRes.json();
      const joinRes = await apiFetch(ROUTES.API.PARTICIPATIONS.BASE, {
        method: 'POST',
        body: JSON.stringify({
          player: ROUTES.IRI.PLAYER(playerId),
          competition: ROUTES.IRI.COMPETITION(competition.id),
        }),
      });

      if (!joinRes.ok) {
        const errorData = await joinRes.json();
        throw new Error(
          errorData.violations?.[0]?.message || "Erreur lors de l'inscription",
        );
      }
      return joinCode;
    },
    onSuccess: async (code) => {
      await refreshUser();
      onSuccess(code);
    },
  });

  return {
    joinByCode: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error?.message,
  };
};
