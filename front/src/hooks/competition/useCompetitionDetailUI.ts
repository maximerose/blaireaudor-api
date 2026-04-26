import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  useAuth,
  useCompetitionData,
  useCompetitionDelete,
  useReportDateLimits,
} from '@/hooks';
import { getTimeRemaining, getIsUrgent } from '@/utils';

export const useCompetitionDetailUI = () => {
  const { user } = useAuth();
  const { code } = useParams<{ code: string }>();
  const { competition, leaderboard, actions, loading, refresh } =
    useCompetitionData(code || '');
  const { deleteCompetition } = useCompetitionDelete();
  const [isReporting, setIsReporting] = useState(false);
  const { minDate, maxDate } = useReportDateLimits(competition);

  const potentialTargets = useMemo(
    () =>
      leaderboard?.map((item) => ({
        id: item.player.id,
        display_name: item.player.display_name,
      })) || [],
    [leaderboard],
  );

  const timeRemaining = competition
    ? getTimeRemaining(competition.end_date)
    : null;
  const isUrgent = competition ? getIsUrgent(competition.end_date) : false;

  const isReferee = useMemo(() => {
    if (!competition || !user) return false;

    return competition.referees.some((ref: any) => {
      const refId = typeof ref === 'string' ? ref.split('/').pop() : ref.id;
      return refId === user.player?.id;
    });
  }, [competition, user]);

  return {
    competition,
    leaderboard,
    actions,
    loading,
    refresh,
    deleteCompetition,
    isReporting,
    setIsReporting,
    potentialTargets,
    minDate,
    maxDate,
    timeRemaining,
    isUrgent,
    isReferee,
  };
};
