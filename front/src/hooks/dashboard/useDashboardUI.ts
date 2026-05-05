import { useMemo, useState } from 'react';
import { useAuth, useDashboardSort } from '@/hooks';

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

  return {
    sortedParticipations,
    managedCompetitions,
    isJoinModalOpen,
    openJoinModal: () => setIsJoinModalOpen(true),
    closeJoinModal: () => setIsJoinModalOpen(false),
  };
};
