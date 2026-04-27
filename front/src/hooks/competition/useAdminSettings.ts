import toast from 'react-hot-toast';
import { useCompetitionAdmin } from './useCompetitionAdmin';
import { useMemo } from 'react';

interface UseAdminSettingsProps {
  competition: any;
  actions: any[];
  refresh: () => void;
}

export const useAdminSettings = ({
  competition,
  actions,
  refresh,
}: UseAdminSettingsProps) => {
  const { updateCompetition, isUpdating } = useCompetitionAdmin(
    competition.id,
    refresh,
  );

  const pendingCount = useMemo(
    () => actions?.filter((a) => a.status === 'pending').length || 0,
    [actions],
  );

  const handleToggleFog = () => {
    updateCompetition({ fog_of_war: !competition.fog_of_war });
  };

  const handleCloseCompetition = () => {
    if (pendingCount > 0) {
      toast.error(
        `Impossible de clore ! Il reste ${pendingCount} signalement(s) à trancher.`,
        {
          icon: '⚖️',
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
