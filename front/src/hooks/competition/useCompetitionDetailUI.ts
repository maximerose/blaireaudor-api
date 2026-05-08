import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useAuth, useCompetitionData, useCompetitionDelete } from '@/hooks';
import {
  isCompetitionCreator,
  isPlayerReferee,
  resolveCreatorName,
} from '@/utils';

export const useCompetitionDetailUI = () => {
  console.log('Je passe dans useCompetitionDetailUI');
  const { user } = useAuth();
  const { code } = useParams<{ code: string }>();

  const { competition, leaderboard, isReady, isRefreshing, refresh } =
    useCompetitionData(code || '');

  const { deleteCompetition } = useCompetitionDelete();

  const [isReporting, setIsReporting] = useState(false);

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
    isReferee,
    isCreator,
    creatorName,
  };
};
