import toast from 'react-hot-toast';
import { useCompetitionAdmin } from '@/hooks';
import type { Competition } from '@/types';
import { CONFIRMS, ERRORS, QUERY_KEYS } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import { competitionService } from '@/services';
import { useConfirmModal } from '@/context';

interface UseAdminSettingsProps {
  competition: Competition;
}

export const useAdminSettings = ({ competition }: UseAdminSettingsProps) => {
  const { updateCompetition, isUpdating } = useCompetitionAdmin();
  const { openModal } = useConfirmModal();

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

    openModal({
      title: CONFIRMS.COMPETITION.CLOSE_TITLE,
      message: CONFIRMS.COMPETITION.CLOSE_MESSAGE,
      onConfirm: () => {
        updateCompetition({ end_date: new Date().toISOString() });
      },
    });
  };

  return {
    isFogActive: competition.fog_of_war,
    isUpdating,
    pendingCount,
    handleToggleFog,
    handleCloseCompetition,
  };
};
