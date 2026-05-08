import { Badge, Button, Card, Text } from '@/components/UI';
import { FogOfWarToggle } from './FogOfWarToggle';
import { CloseCompetitionAction } from './CloseCompetitionAction';
import { RefereeManagement } from './RefereeManagement';
import { CompetitionGeneralSettings } from './CompetitionGeneralSettings';
import { useState } from 'react';
import { cn } from '@/utils';
import { BonusDayManagement } from './BonusDayManagement';
import { COMPETITION_UI, BUTTONS, ICONS } from '@/constants';
import type { Competition } from '@/types';
import { AdminProvider } from '@/context/AdminProvider';

interface AdminSettingsProps {
  competition: Competition;
  refresh: () => void;
}

export const AdminSettings = ({ competition, refresh }: AdminSettingsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!competition) return null;

  const isFogActive = competition.fog_of_war;

  return (
    <AdminProvider competition={competition} refresh={refresh}>
      <Card
        variant="dark"
        className={cn(
          'border-gold/30 bg-gold/5 mb-10 overflow-hidden transition-all duration-300',
          isExpanded ? 'p-6 overflow-visible' : 'p-3 sm:p-4 overflow-hidden',
        )}
      >
        {/* --- HEADER COMPACT (Toujours visible) --- */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold/10 rounded-lg text-gold hidden sm:block">
              <span className="text-xl">{ICONS.SETTINGS}</span>
            </div>
            <div>
              <Text
                variant="caption"
                className="font-bold uppercase tracking-widest text-gold/80"
              >
                {COMPETITION_UI.ADMIN.GENERAL.TITLE}
              </Text>
              {!isExpanded && (
                <div className="flex gap-2 mt-1">
                  <Badge
                    variant={isFogActive ? 'info' : 'ghost'}
                    className="text-[8px] py-0"
                  >
                    {COMPETITION_UI.ADMIN.FOG.LABEL}{' '}
                    {isFogActive
                      ? COMPETITION_UI.ADMIN.FOG.STATUS_ACTIVE
                      : COMPETITION_UI.ADMIN.FOG.STATUS_OFF}
                  </Badge>
                  <Badge variant="ghost" className="text-[8px] py-0">
                    {COMPETITION_UI.ADMIN.GENERAL.REFEREES_COUNT(
                      competition.referees?.length || 0,
                    )}
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
            {isExpanded
              ? BUTTONS.COLLAPSE
              : COMPETITION_UI.ADMIN.GENERAL.BUTTON_EXPAND}
          </Button>
        </div>

        {/* --- CONTENU DÉROULANT --- */}
        <div
          className={cn(
            'grid transition-all duration-300 ease-in-out',
            isExpanded
              ? 'grid-rows-[1fr] opacity-100 mt-6 overflow-visible'
              : 'grid-rows-[0fr] opacity-0 overflow-hidden',
          )}
        >
          <div
            className={cn(
              'flex flex-col gap-8',
              isExpanded ? 'overflow-visible' : 'overflow-hidden',
            )}
          >
            {/* Section 1 : Configuration (Moins massive) */}
            <section className="space-y-3">
              <CompetitionGeneralSettings competition={competition} />
            </section>

            {/* Section 2 : Actions rapides (Horizontal Grid) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5">
              <FogOfWarToggle />
              <div className="md:border-l md:border-white/10 md:pl-6 flex justify-center">
                <CloseCompetitionAction />
              </div>
            </section>

            {/* Section 3 : Arbitrage */}
            <section className="space-y-3">
              <RefereeManagement />
              <BonusDayManagement />
            </section>
          </div>
        </div>
      </Card>
    </AdminProvider>
  );
};
