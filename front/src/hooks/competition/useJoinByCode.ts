import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks';
import { competitionService } from '@/services/api/competition';
import { ERRORS } from '@/constants';

export const useJoinByCode = (onSuccess: (code: string) => void) => {
  const { user, refreshUser } = useAuth();

  const mutation = useMutation({
    mutationFn: async (joinCode: string) => {
      const playerId = user?.player?.id;

      if (!playerId) {
        throw new Error(ERRORS.AUTH.SESSION_EXPIRED);
      }

      const competition = await competitionService.getByCode(joinCode);

      await competitionService.join(playerId, competition.id);

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
