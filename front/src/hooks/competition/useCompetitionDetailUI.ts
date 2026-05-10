import { useParams } from 'react-router-dom';
import { useCompetitionData } from '@/hooks';

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
