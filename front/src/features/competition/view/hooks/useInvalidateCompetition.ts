import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared';
import { useAuthContext } from '@/features/account/context/AuthContext';

export const useInvalidateCompetition = () => {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuthContext();

  const invalidateAll = async (id: string | undefined, code?: string) => {
    if (!id) return;

    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.competition.byId(id).root,
      exact: false,
    });

    if (code) {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.competition.byCode(code),
        exact: false,
      });
    }

    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.auth.me,
      exact: false,
    });

    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.competition.all,
      exact: true,
    });

    await refreshUser();
  };

  return { invalidateAll };
};
