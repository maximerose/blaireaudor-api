import { Badge, Button, Card, Text } from '@/components/UI';
import { useAdminSettings, useAuth } from '@/hooks';
import { FogOfWarToggle } from './FogOfWarToggle';
import { CloseCompetitionAction } from './CloseCompetitionAction';
import { RefereeManagement } from './RefereeManagement';
import { CompetitionGeneralSettings } from './CompetitionGeneralSettings';
import { useState } from 'react';
import { cn } from '@/utils';
import { BonusDayManagement } from './BonusDayManagement';

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
  const [isExpanded, setIsExpanded] = useState(false);
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
      className={cn(
        "border-gold/30 bg-gold/5 mb-10 overflow-hidden transition-all duration-300",
        isExpanded ? "p-6 overflow-visible" : "p-3 sm:p-4 overflow-hidden"
      )}
    >
      {/* --- HEADER COMPACT (Toujours visible) --- */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold/10 rounded-lg text-gold hidden sm:block">
            <span className="text-xl">🛠️</span>
          </div>
          <div>
            <Text variant="caption" className="font-bold uppercase tracking-widest text-gold/80">
              Console d'administration
            </Text>
            {!isExpanded && (
              <div className="flex gap-2 mt-1">
                <Badge variant={isFogActive ? "info" : "ghost"} className="text-[8px] py-0">
                  Brouillard: {isFogActive ? 'Actif' : 'Inactif'}
                </Badge>
                <Badge variant="ghost" className="text-[8px] py-0">
                  {competition.referees?.length} Arbitre(s)
                </Badge>
              </div>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:bg-gold/10"
        >
          {isExpanded ? 'Réduire' : 'Gérer l\'arène'}
        </Button>
      </div>

      {/* --- CONTENU DÉROULANT --- */}
      <div className={cn(
        "grid transition-all duration-300 ease-in-out",
        isExpanded ? "grid-rows-[1fr] opacity-100 mt-6 overflow-visible" : "grid-rows-[0fr] opacity-0 overflow-hidden"
      )}>
        <div className={cn(
          "flex flex-col gap-8",
          isExpanded ? "overflow-visible" : "overflow-hidden"
        )}>

          {/* Section 1 : Configuration (Moins massive) */}
          <section className="space-y-3">
            <header className="flex items-center gap-2 opacity-40">
              <span className="text-xs">⚙️</span>
              <Text variant="micro" className="uppercase font-bold tracking-tighter">Configuration</Text>
            </header>
            <CompetitionGeneralSettings competition={competition} onRefresh={refresh} />
          </section>

          {/* Section 2 : Actions rapides (Horizontal Grid) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5">
            <FogOfWarToggle
              isActive={isFogActive}
              onToggle={handleToggleFog}
              isLoading={isUpdating}
            />
            <div className="md:border-l md:border-white/10 md:pl-6 flex justify-center">
              <CloseCompetitionAction
                onSafeClose={handleCloseCompetition}
                isLoading={isUpdating}
                pendingCount={pendingCount}
              />
            </div>
          </section>

          {/* Section 3 : Arbitrage */}
          <section className="space-y-3">
            <header className="flex items-center gap-2 opacity-40">
              <span className="text-xs">⚖️</span>
              <Text variant="micro" className="uppercase font-bold tracking-tighter">Équipe d'arbitrage</Text>
            </header>
            <RefereeManagement
              competition={competition}
              currentUser={user}
              onRefresh={refresh}
            />

            <BonusDayManagement />
          </section>
        </div>
      </div>
    </Card>
  );
};
