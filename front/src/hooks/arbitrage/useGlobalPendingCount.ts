import { QUERY_KEYS } from '@/constants';
import { useAuthContext } from '@/context';
import { actionService } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useGlobalPendingCount = () => {
  const { user } = useAuthContext();

  const isReferee = (user?.player?.refereed_competitions?.length || 0) > 0;

  const { data: count = 0 } = useQuery({
    queryKey: QUERY_KEYS.arbitrage.pendingGlobal,
    queryFn: ({ signal }) => actionService.getGlobalPendingCount(signal),
    enabled: isReferee,
    refetchInterval: 1000 * 60,
  });

  return { count, isReferee };
};
