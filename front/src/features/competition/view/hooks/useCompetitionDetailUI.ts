import { useParams } from 'react-router-dom';
import { useCompetitionData } from '@/features/competition';

export const useCompetitionDetailUI = () => {
  const { code } = useParams<{ code: string }>();

  const { competition, leaderboard, isReady, isRefreshing, refresh } =
    useCompetitionData(code || '');

  return {
    competition,
    leaderboard,
    isReady,
    isRefreshing,
    refresh,
  };
};
