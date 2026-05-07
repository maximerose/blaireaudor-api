import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  useAuth,
  useCompetitionData,
  useCompetitionDelete,
  useInfiniteActions,
} from '@/hooks';
import {
  isCompetitionCreator,
  isPlayerReferee,
  resolveCreatorName,
} from '@/utils';
import { ActionStatus, type Action, type Participation } from '@/types';

export const useCompetitionDetailUI = () => {
  const { user } = useAuth();
  const { code } = useParams<{ code: string }>();
  const { competition, leaderboard, isReady, isRefreshing, refresh } =
    useCompetitionData(code || '');
  const { actions, totalActions, isLoadingActions } = useInfiniteActions(
    competition?.id,
  );
  const { deleteCompetition } = useCompetitionDelete();
  const [isReporting, setIsReporting] = useState(false);

  const entriesCount = useMemo(() => {
    if (!actions) return 0;
    const isReferee = isPlayerReferee(competition, user?.player?.id);

    if (isReferee) return totalActions;

    return actions.filter((a: Action) => a.status !== ActionStatus.REJECTED)
      .length;
  }, [actions, competition, user]);

  const potentialTargets = useMemo(
    () =>
      leaderboard?.map((item: Participation) => ({
        id: item.player.id,
        display_name: item.player.display_name,
      })) || [],
    [leaderboard],
  );

  const isReferee = isPlayerReferee(competition, user?.player?.id);
  const isCreator = isCompetitionCreator(competition, user);

  const creatorName = useMemo(
    () => resolveCreatorName(competition, leaderboard, user),
    [competition, leaderboard, user],
  );

  return {
    competition,
    leaderboard,
    actions,
    isReady: isReady && !isLoadingActions,
    isRefreshing,
    refresh,
    deleteCompetition,
    isReporting,
    setIsReporting,
    potentialTargets,
    isReferee,
    isCreator,
    creatorName,
    entriesCount,
  };
};
