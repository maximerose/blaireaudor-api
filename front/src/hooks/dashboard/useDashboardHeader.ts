import { useMemo } from 'react';
import { useAuth } from '@/hooks';
import { getCompetitionStatus } from '@/utils';
import { DASHBOARD_UI } from '@/constants';
import { CompetitionStatus } from '@/types';

export const useDashboardHeader = () => {
  const { user } = useAuth();
  const participations = user?.player?.participations || [];

  const stats = useMemo(() => {
    const initialStats = {
      active: 0,
      upcoming: 0,
      finished: 0,
      created: user?.created_competitions?.length || 0,
      refereed: user?.player?.refereed_competitions?.length || 0,
    };

    return participations.reduce((acc, p) => {
      const status = getCompetitionStatus(
        p.competition.start_date,
        p.competition.end_date,
      );
      if (status === CompetitionStatus.ACTIVE) acc.active++;
      else if (status === CompetitionStatus.FINISHED) acc.finished++;
      else if (status === CompetitionStatus.UPCOMING) acc.upcoming++;
      return acc;
    }, initialStats);
  }, [
    participations,
    user?.created_competitions,
    user?.player?.refereed_competitions,
  ]);

  const statItems = [
    {
      label: DASHBOARD_UI.HEADER.STATS.ACTIVE,
      val: stats.active,
      color: 'text-success-bright',
    },
    {
      label: DASHBOARD_UI.HEADER.STATS.UPCOMING,
      val: stats.upcoming,
      color: 'text-info-bright',
    },
    {
      label: DASHBOARD_UI.HEADER.STATS.FINISHED,
      val: stats.finished,
      color: 'text-danger-bright',
    },
    {
      label: DASHBOARD_UI.HEADER.STATS.CREATED,
      val: stats.created,
      color: 'text-gold',
    },
    {
      label: DASHBOARD_UI.HEADER.STATS.REFEREED,
      val: stats.refereed,
      color: 'text-info-bright',
    },
  ];

  return {
    displayName: user?.player?.display_name,
    totalParticipations: participations.length,
    statItems,
  };
};
