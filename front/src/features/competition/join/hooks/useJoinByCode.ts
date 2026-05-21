import { useMutation } from '@tanstack/react-query';
import { competitionService } from '@/features/competition/services';
import { ERRORS, type ApiError } from '@/shared';
import { useAuthContext } from '@/features/account';

export const useJoinByCode = (onSuccess: (code: string) => void) => {
  const { user, refreshUser } = useAuthContext();

  const mutation = useMutation<string, ApiError, string>({
    mutationFn: async (joinCode: string) => {
      const playerId = user?.player?.id;

      if (!playerId) {
        throw { message: ERRORS.AUTH.SESSION_EXPIRED };
      }

      const { competition } = await competitionService.getByCode(joinCode);

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
