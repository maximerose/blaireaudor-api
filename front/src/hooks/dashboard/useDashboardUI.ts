import { useMemo, useState } from 'react';
import { useAuth, useDashboardSort } from '@/hooks';
import { CompetitionStatus, getCompetitionStatus } from '@/utils';

export const useDashboardUI = () => {
  const { user } = useAuth();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const participations = user?.player?.participations || [];
  const sortedParticipations = useDashboardSort(participations);

  const stats = useMemo(() => {
    return participations.reduce(
      (acc, p) => {
        const status = getCompetitionStatus(
          p.competition.start_date,
          p.competition.end_date,
        );
        if (status === CompetitionStatus.ACTIVE) acc.active++;
        if (status === CompetitionStatus.FINISHED) acc.finished++;
        if (status === CompetitionStatus.UPCOMING) acc.upcoming++;
        return acc;
      },
      { active: 0, finished: 0, upcoming: 0 },
    );
  }, [participations]);

  return {
    user,
    participations,
    sortedParticipations,
    stats,
    isJoinModalOpen,
    setIsJoinModalOpen,
  };
};
