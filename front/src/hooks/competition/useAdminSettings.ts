import toast from 'react-hot-toast';
import { useCompetitionAdmin } from '@/hooks';
import type { Competition } from '@/types';
import { CONFIRMS, ERRORS, QUERY_KEYS } from '@/constants';
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
      toast.error(ERRORS.COMPETITION.CLOSE_PENDING_ACTIONS(pendingCount));
      return;
    }

    const confirmed = window.confirm(CONFIRMS.COMPETITION.CLOSE);

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
