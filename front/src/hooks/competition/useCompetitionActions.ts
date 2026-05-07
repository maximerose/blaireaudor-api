import { useInfiniteQuery } from '@tanstack/react-query';
import { competitionService } from '@/services/api/competitionService';
import { QUERY_KEYS } from '@/constants';

export const useCompetitionActions = (competitionId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.competition.byId(competitionId!).actions,
    queryFn: ({ pageParam = 1, signal }) =>
      competitionService.getActions(competitionId!, pageParam, signal),
    initialPageParam: 1,
    enabled: !!competitionId,
    getNextPageParam: (lastPage) => {
      const { page, last_page } = lastPage.meta;
      return page < last_page ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};
