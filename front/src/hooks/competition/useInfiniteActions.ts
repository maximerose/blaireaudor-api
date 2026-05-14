import { useEffect, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { competitionService } from '@/services';
import { QUERY_KEYS } from '@/constants';

export const useInfiniteActions = (
  competitionId: string | undefined,
  selectedDate: string | null,
  selectedPlayerId: string | null,
  sortField: string,
  sortOrder: 'asc' | 'desc',
) => {
  const { ref, inView } = useInView();

  const query = useInfiniteQuery({
    queryKey: [
      ...QUERY_KEYS.competition.byId(competitionId!).actions,
      {
        date: selectedDate,
        playerId: selectedPlayerId,
        sort: sortField,
        order: sortOrder,
      },
    ],
    queryFn: ({ pageParam = 1, signal }) =>
      competitionService.getActions({
        id: competitionId!,
        page: pageParam,
        selectedDate,
        selectedPlayerId,
        sortField,
        sortOrder,
        signal,
      }),
    initialPageParam: 1,
    enabled: !!competitionId,
    getNextPageParam: (lastPage) => {
      const { page, last_page } = lastPage.meta;
      return page < last_page ? page + 1 : undefined;
    },
  });

  useEffect(() => {
    if (inView && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [inView, query]);

  const actions = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data?.pages],
  );

  return {
    actions,
    totalActions: query.data?.pages[0]?.meta.total ?? 0,
    loadMoreRef: ref,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    isLoadingActions: query.isLoading,
  };
};
