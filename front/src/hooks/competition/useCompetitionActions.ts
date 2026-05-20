import { useInfiniteQuery } from '@tanstack/react-query';
import { competitionService } from '@/services';
import { QUERY_KEYS } from '@/shared';

export const useCompetitionActions = (competitionId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.competition.byId(competitionId!).actions,
    queryFn: ({ pageParam = 1, signal }) =>
      competitionService.getActions({
        id: competitionId!,
        page: pageParam,
        signal,
      }),
    initialPageParam: 1,
    enabled: !!competitionId,
    getNextPageParam: (lastPage) => {
      const { page, last_page } = lastPage.meta;
      return page < last_page ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};
