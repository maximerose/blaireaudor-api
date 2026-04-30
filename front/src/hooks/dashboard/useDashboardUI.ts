import { useMemo, useState } from 'react';
import { useAuth, useDashboardSort } from '@/hooks';
import { CompetitionStatus, getCompetitionStatus } from '@/utils';

export const useDashboardUI = () => {
  const { user } = useAuth();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const participations = user?.player?.participations || [];
  const sortedParticipations = useDashboardSort(participations);

  const managedCompetitions = useMemo(() => {
    if (!user) return [];

    const created = user.created_competitions || [];
    const refereed = user.player?.refereed_competitions || [];

    const allManaged = [...created, ...refereed];
    const participatingIds = participations.map((p) => p.competition.id);
    const seenIds = new Set();

    return allManaged.filter((comp) => {
      const isDuplicate = seenIds.has(comp.id);
      const isAlreadyPlaying = participatingIds.includes(comp.id);

      if (isDuplicate || isAlreadyPlaying) return false;

      seenIds.add(comp.id);
      return true;
    });
  }, [user, participations]);

  const stats = useMemo(() => {
    const initialStats = {
      active: 0,
      upcoming: 0,
      finished: 0,
      created: 0,
      refereed: 0,
    };
    return participations.reduce((acc, p) => {
      const status = getCompetitionStatus(
        p.competition.start_date,
        p.competition.end_date,
      );
      if (status === CompetitionStatus.ACTIVE) acc.active++;
      if (status === CompetitionStatus.FINISHED) acc.finished++;
      if (status === CompetitionStatus.UPCOMING) acc.upcoming++;
      return acc;
    }, initialStats);
  }, [participations]);

  stats.created = user?.created_competitions?.length || 0;
  stats.refereed = user?.player?.refereed_competitions?.length || 0;


  return {
    user,
    participations,
    sortedParticipations,
    managedCompetitions,
    stats,
    isJoinModalOpen,
    openJoinModal: () => setIsJoinModalOpen(true),
    closeJoinModal: () => setIsJoinModalOpen(false),
  };
};
