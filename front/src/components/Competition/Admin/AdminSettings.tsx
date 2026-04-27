import { Card } from '@/components/UI';
import { useAdminSettings } from '@/hooks';
import { FogOfWarToggle } from './FogOfWarToggle';
import { CloseCompetitionAction } from './CloseCompetitionAction';

interface AdminSettingsProps {
  competition: any;
  actions: any[];
  refresh: () => void;
}

export const AdminSettings = ({
  competition,
  actions,
  refresh,
}: AdminSettingsProps) => {
  const {
    isFogActive,
    isUpdating,
    pendingCount,
    handleToggleFog,
    handleCloseCompetition,
  } = useAdminSettings({
    competition,
    actions,
    refresh,
  });

  return (
    <Card
      variant="dark"
      className="border-gold/30 bg-gold/5 p-6 mb-10 animate-slide-down"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <FogOfWarToggle
          isActive={isFogActive}
          onToggle={handleToggleFog}
          isLoading={isUpdating}
        />

        <CloseCompetitionAction
          onSafeClose={handleCloseCompetition}
          isLoading={isUpdating}
          pendingCount={pendingCount}
        />
      </div>
    </Card>
  );
};
