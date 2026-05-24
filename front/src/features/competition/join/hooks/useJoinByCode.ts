import { useMutation } from '@tanstack/react-query';
import { competitionService } from '@/features/competition/services';
import { ERRORS, SUCCESS, type ApiError } from '@/shared';
import { useAuthContext } from '@/features/account';
import toast from 'react-hot-toast';
import { handleApiError } from '@/shared/utils/errorHandler';

export const useJoinByCode = (
  onSuccess: (code: string) => void,
  setError?: any,
) => {
  const { refreshUser } = useAuthContext();

  const mutation = useMutation<string, ApiError, string>({
    mutationFn: async (joinCode: string) => {
      const cleanCode = joinCode.toUpperCase().trim();
      await competitionService.join(cleanCode);
      return cleanCode;
    },
    onSuccess: async (code) => {
      await refreshUser();
      toast.success(SUCCESS.COMPETITION.PARTICIPANTS_UPDATED);
      onSuccess(code);
    },
    onError: (e) => handleApiError(e, setError, ERRORS.COMPETITION.JOIN_FAILED),
  });

  return {
    joinByCode: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error?.message,
  };
};
