import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';

export const useInvalidateCompetition = () => {
  const queryClient = useQueryClient();

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
  };

  return { invalidateAll };
};
