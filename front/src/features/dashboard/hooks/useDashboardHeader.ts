import { DASHBOARD_UI } from '@/features/dashboard/constants';
import { useAuthContext } from '@/features/account';

export const useDashboardHeader = () => {
  const { user } = useAuthContext();
  const participations = user?.player?.participations || [];
  const stats = user?.stats;

  const compsStatsItems = [
    {
      id: 'ongoing',
      label: DASHBOARD_UI.HEADER.STATS.ACTIVE,
      val: stats?.ongoing_competitions || 0,
      color: 'text-success-bright',
    },
    {
      id: 'upcoming',
      label: DASHBOARD_UI.HEADER.STATS.UPCOMING,
      val: stats?.upcoming_competitions || 0,
      color: 'text-info-bright',
    },
    {
      id: 'finished',
      label: DASHBOARD_UI.HEADER.STATS.FINISHED(
        stats?.finished_competitions || 0,
      ),
      val: stats?.finished_competitions || 0,
      color: 'text-danger-bright',
    },
  ];

  const rolesStatsItems = [
    {
      id: 'created',
      label: DASHBOARD_UI.HEADER.STATS.CREATED(
        stats?.created_competitions || 0,
      ),
      val: stats?.created_competitions || 0,
      color: 'text-role-creator-bright',
    },
    {
      id: 'refereed',
      label: DASHBOARD_UI.HEADER.STATS.REFEREED(
        stats?.refereed_competitions || 0,
      ),
      val: stats?.refereed_competitions || 0,
      color: 'text-role-referee-bright',
    },
  ];

  const hasRoles = rolesStatsItems.some((item) => item.val > 0);

  return {
    displayName: user?.player?.display_name,
    totalParticipations: participations.length,
    compsStatsItems,
    rolesStatsItems: hasRoles ? rolesStatsItems : [],
  };
};
