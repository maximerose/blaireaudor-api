import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useAuth, useCompetitionData, useCompetitionDelete } from '@/hooks';
import {
  isCompetitionCreator,
  isPlayerReferee,
  resolveCreatorName,
} from '@/utils';
import { type Participation } from '@/types';

export const useCompetitionDetailUI = () => {
  const { user } = useAuth();
  const { code } = useParams<{ code: string }>();

  const { competition, leaderboard, isReady, isRefreshing, refresh } =
    useCompetitionData(code || '');

  const { deleteCompetition } = useCompetitionDelete();
  const [isReporting, setIsReporting] = useState(false);

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
    isReady,
    isRefreshing,
    refresh,
    deleteCompetition,
    isReporting,
    setIsReporting,
    potentialTargets,
    isReferee,
    isCreator,
    creatorName,
  };
};
