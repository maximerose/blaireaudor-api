import toast from 'react-hot-toast';
import { useCompetitionAdmin } from '@/hooks';
import type { Competition } from '@/types';
import { ICONS, QUERY_KEYS } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import { competitionService } from '@/services/api/competitionService';

interface UseAdminSettingsProps {
  competition: Competition;
}

export const useAdminSettings = ({ competition }: UseAdminSettingsProps) => {
  const { updateCompetition, isUpdating } = useCompetitionAdmin();

  const handleToggleFog = () => {
    updateCompetition({ fog_of_war: !competition.fog_of_war });
  };

  const { data: pendingCount = 0 } = useQuery({
    queryKey: QUERY_KEYS.competition.byId(competition.id).pendingCount,
    queryFn: () => competitionService.getPendingCount(competition.id!),
    enabled: !!competition.id,
  });

  const handleCloseCompetition = () => {
    if (pendingCount > 0) {
      toast.error(
        `Impossible de clôturer ! Il reste ${pendingCount} signalement(s) à trancher.`,
        {
          icon: ICONS.REFEREE,
          style: { borderRadius: '10px', background: '#333', color: '#fff' },
        },
      );
      return;
    }

    const confirmed = window.confirm(
      '🚩 CONFIRMATION : Terminer la compétition maintenant ? Le classement sera gelé et plus aucun signalement ne sera possible.',
    );

    if (confirmed) {
      updateCompetition({ end_date: new Date().toISOString() });
    }
  };

  return {
    isFogActive: competition.fog_of_war,
    isUpdating,
    pendingCount,
    handleToggleFog,
    handleCloseCompetition,
  };
};
