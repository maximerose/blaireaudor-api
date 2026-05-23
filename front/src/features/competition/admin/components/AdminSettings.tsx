import { useState } from 'react';
import {
  Badge,
  BADGE_VARIANT,
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  BUTTONS,
  Card,
  CARD_VARIANT,
  cn,
  ICONS,
  Text,
  TEXT_VARIANT,
  Stack,
  Row,
  Grid,
} from '@/shared';
import { BonusDayManagement } from './BonusDayManagement';
import { CloseCompetitionAction } from './CloseCompetitionAction';
import { CompetitionGeneralSettings } from './CompetitionGeneralSettings';
import { DeleteCompetitionAction } from './DeleteCompetitionAction';
import { FogOfWarToggle } from './FogOfWarToggle';
import { RefereeManagement } from './RefereeManagement';
import { COMPETITION_UI } from '@/features/competition/constants';
import {
  useCompetitionContext,
  AdminProvider,
} from '@/features/competition/context';
import { usePermissions } from '@/features/competition/hooks';

export const AdminSettings = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { competition } = useCompetitionContext();
  const { roles, canEditSettings, canManageGame, canManageParticipants } =
    usePermissions();

  if (!roles.isManager || competition.is_finished) return null;

  const isFogActive = competition.fog_of_war;

  return (
    <AdminProvider competition={competition}>
      <Card
        variant={CARD_VARIANT.DARK}
        className={cn(
          'max-w-3xl mx-auto w-full border-gold/30 bg-gold/5 overflow-hidden transition-all duration-300',
          isExpanded
            ? 'p-4 sm:p-6 overflow-visible'
            : 'p-3 sm:p-4 overflow-hidden',
        )}
      >
        <Row
          justify="between"
          align="center"
          className="flex-col sm:flex-row gap-4"
        >
          <Row align="center" gap="md" className="sm:w-auto">
            <div className="p-2 bg-gold/10 rounded-lg text-gold hidden sm:block shrink-0">
              <span className="text-xl">{ICONS.SETTINGS}</span>
            </div>

            <Stack
              gap="none"
              className="min-w-0 flex-1 text-center sm:text-left"
            >
              <Text
                variant={TEXT_VARIANT.CAPTION}
                className="font-bold uppercase tracking-widest text-gold/80"
              >
                {COMPETITION_UI.ADMIN.GENERAL.TITLE}
              </Text>

              {!isExpanded && (
                <Row
                  wrap
                  gap="xs"
                  justify="center"
                  className="sm:justify-start mt-1"
                >
                  <Badge
                    variant={
                      isFogActive ? BADGE_VARIANT.INFO : BADGE_VARIANT.GHOST
                    }
                    className="text-[8px] py-0 whitespace-nowrap"
                  >
                    {COMPETITION_UI.ADMIN.FOG.LABEL}{' '}
                    {isFogActive
                      ? COMPETITION_UI.ADMIN.FOG.STATUS_ACTIVE
                      : COMPETITION_UI.ADMIN.FOG.STATUS_OFF}
                  </Badge>
                  <Badge
                    variant={BADGE_VARIANT.GHOST}
                    className="text-[8px] py-0 whitespace-nowrap"
                  >
                    {COMPETITION_UI.ADMIN.GENERAL.REFEREES_COUNT(
                      competition.referees?.length || 0,
                    )}
                  </Badge>
                </Row>
              )}
            </Stack>
          </Row>

          <Button
            variant={BUTTON_VARIANT.GHOST}
            size={BUTTON_SIZE.SMALL}
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:bg-gold/10 shrink-0 w-full sm:w-auto cursor-pointer"
          >
            {isExpanded
              ? BUTTONS.COLLAPSE
              : COMPETITION_UI.ADMIN.GENERAL.BUTTON_EXPAND}
          </Button>
        </Row>

        {/* --- CONTENU DÉROULANT --- */}
        <div
          className={cn(
            'grid transition-all duration-300 ease-in-out',
            isExpanded
              ? 'grid-rows-[1fr] opacity-100 mt-6 overflow-visible'
              : 'grid-rows-[0fr] opacity-0 overflow-hidden',
          )}
        >
          <Stack
            gap="xl"
            className={cn(
              'min-h-0',
              isExpanded ? 'overflow-visible' : 'overflow-hidden',
            )}
          >
            {/* Section 1 : Configuration Générale */}
            {canEditSettings.allowed && (
              <Stack as="section" gap="sm">
                <CompetitionGeneralSettings />
              </Stack>
            )}

            {/* Section 2 : Actions de jeu (Brouillard & Clôture) */}
            {canManageGame.allowed && (
              <Grid
                as="section"
                cols={1}
                md={competition.has_started ? 2 : 1}
                gap="md"
                align="center"
                className="p-4 bg-surface-base rounded-2xl border border-border-subtle"
              >
                <FogOfWarToggle />
                {competition.has_started && (
                  <div className="md:border-l md:border-border-base md:pl-6 flex justify-center w-full">
                    <CloseCompetitionAction />
                  </div>
                )}
              </Grid>
            )}

            {/* Section 3 : Panels de gestion avancée */}
            <Grid as="section" cols={1} lg={2} gap="xl" align="start">
              {canManageParticipants.allowed && <RefereeManagement />}
              {canManageGame.allowed && <BonusDayManagement />}
            </Grid>

            <DeleteCompetitionAction />
          </Stack>
        </div>
      </Card>
    </AdminProvider>
  );
};
