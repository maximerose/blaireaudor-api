import { useMutation } from '@tanstack/react-query';
import { competitionService } from '@/features/competition/services';
import { type ApiError } from '@/shared';
import { useAuthContext } from '@/features/account';

export const useJoinByCode = (onSuccess: (code: string) => void) => {
  const { refreshUser } = useAuthContext();

  const mutation = useMutation<string, ApiError, string>({
    mutationFn: async (joinCode: string) => {
      const cleanCode = joinCode.toUpperCase().trim();
      await competitionService.join(cleanCode);
      return cleanCode;
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
