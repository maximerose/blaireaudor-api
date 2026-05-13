import { useMemo, useState } from 'react';
import { useAuth } from '@/hooks';
import type { DashboardItem } from '@/types';

export const useDashboardUI = () => {
  const { user } = useAuth();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const hasAdminAccess = useMemo(() => {
    if (!user) return false;

    const createdCount = user.created_competitions?.length || 0;
    const refereedCount = user.player?.refereed_competitions?.length || 0;

    return createdCount > 0 || refereedCount > 0;
  }, [user]);

  const allCompetitions = useMemo(() => {
    if (!user) return [];

    const competitionsMap = new Map<string, DashboardItem>();

    const participations = user?.player?.participations || [];
    participations.forEach((p) => {
      competitionsMap.set(p.competition.id, {
        competition: p.competition,
        participation: p,
      });
    });

    const created = user.created_competitions || [];
    const refereed = user.player?.refereed_competitions || [];

    [...created, ...refereed].forEach((comp) => {
      if (!competitionsMap.has(comp.id)) {
        competitionsMap.set(comp.id, { competition: comp });
      }
    });

    return Array.from(competitionsMap.values());
  }, [user]);

  const { ongoing, upcoming, finished } = useMemo(() => {
    const now = new Date();

    const categorized = {
      ongoing: [] as DashboardItem[],
      upcoming: [] as DashboardItem[],
      finished: [] as DashboardItem[],
    };

    allCompetitions.forEach((item) => {
      const { competition } = item;

      if (competition.is_finished) {
        categorized.finished.push(item);
      } else if (new Date(competition.start_date) > now) {
        categorized.upcoming.push(item);
      } else {
        categorized.ongoing.push(item);
      }
    });

    categorized.ongoing.sort((a, b) => {
      const dateA = a.competition.end_date
        ? new Date(a.competition.end_date).getTime()
        : Infinity;
      const dateB = b.competition.end_date
        ? new Date(b.competition.end_date).getTime()
        : Infinity;
      return dateA - dateB;
    });

    categorized.upcoming.sort((a, b) => {
      const dateA = new Date(a.competition.start_date).getTime();
      const dateB = new Date(b.competition.start_date).getTime();
      return dateA - dateB;
    });

    categorized.finished.sort((a, b) => {
      const dateA = a.competition.end_date
        ? new Date(a.competition.end_date).getTime()
        : new Date(a.competition.start_date).getTime();
      const dateB = b.competition.end_date
        ? new Date(b.competition.end_date).getTime()
        : new Date(b.competition.start_date).getTime();
      return dateB - dateA;
    });

    return categorized;
  }, [allCompetitions]);

  return {
    ongoing,
    upcoming,
    finished,
    hasAdminAccess,
    isJoinModalOpen,
    openJoinModal: () => setIsJoinModalOpen(true),
    closeJoinModal: () => setIsJoinModalOpen(false),
  };
};
