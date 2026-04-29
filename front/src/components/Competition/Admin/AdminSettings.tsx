import { Card } from '@/components/UI';
import { useAdminSettings, useAuth } from '@/hooks';
import { FogOfWarToggle } from './FogOfWarToggle';
import { CloseCompetitionAction } from './CloseCompetitionAction';
import { RefereeManagement } from './RefereeManagement';

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

  const user = useAuth();

  return (
    <Card
      variant="dark"
      className="border-gold/30 bg-gold/5 p-4 sm:p-6 mb-10 animate-slide-down flex flex-col gap-6"
    >
      {/* On utilise items-start sur desktop pour éviter l'étirement vertical du bouton.
        justify-between répartit l'espace horizontalement.
      */}
      <div className="flex flex-col items-center lg:flex-row lg:items-start justify-between gap-6">

        {/* Le bloc de gauche (Brouillard) prend l'espace nécessaire */}
        <div className="flex-1">
          <FogOfWarToggle
            isActive={isFogActive}
            onToggle={handleToggleFog}
            isLoading={isUpdating}
          />
        </div>

        <div className="shrink-0 flex items-center lg:items-start lg:pt-2">
          <CloseCompetitionAction
            onSafeClose={handleCloseCompetition}
            isLoading={isUpdating}
            pendingCount={pendingCount}
          />
        </div>
      </div>

      <RefereeManagement
        competition={competition}
        currentUser={user}
        onRefresh={refresh}
      />
    </Card>
  );
};
