import { useParams, useSearchParams } from 'react-router-dom';
import { useCompetitionData } from './useCompetitionData';

export const useCompetitionDetailUI = () => {
  const { code } = useParams<{ code: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { competition, leaderboard, isReady, isRefreshing, refresh } =
    useCompetitionData(code || '');

  const activeTab =
    (searchParams.get('tab') as 'leaderboard' | 'stats') || 'leaderboard';

  const handleTabChange = (tab: 'leaderboard' | 'stats') => {
    setSearchParams(
      (prev) => {
        prev.set('tab', tab);
        return prev;
      },
      { replace: true },
    );
  };

  return {
    competition,
    leaderboard,
    isReady,
    isRefreshing,
    refresh,
    activeTab,
    handleTabChange,
  };
};
