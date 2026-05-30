import { PLAYER_STATS_GENERAL } from '@/features/stats/constants';
import { useDashboardStats } from '@/features/stats/hooks';
import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Grid,
  HintModal,
  ROUTES,
  Row,
  SECTION_HEADER_THEME,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Stack,
} from '@/shared';
import { StatCard } from './StatCard';
import { StatFocusCard } from './StatFocusCard';

export const DashboardStats = () => {
  const { stats, teaserMetrics, focusCards, activeHint, setActiveHint } =
    useDashboardStats();

  if (!stats || teaserMetrics.length === 0) return null;

  return (
    <Stack gap="md" className="w-full animate-fade-in">
      <SectionHeader
        variant={SECTION_HEADER_VARIANT.DIVIDER}
        colorTheme={SECTION_HEADER_THEME.GOLD}
        title={PLAYER_STATS_GENERAL.TITLE}
      />

      <Grid cols={1} lg={12} gap="sm" className="w-full items-center">
        {/* Partie Gauche : La triplette de cartes Flash de carrière */}
        <div className="lg:col-span-7 w-full">
          <Grid cols={3} gap="xs" className="w-full h-full content-start">
            {teaserMetrics.map((m) => (
              <StatCard
                key={m.label}
                metric={m}
                onClick={
                  m.hint ? () => setActiveHint(m.hint || null) : undefined
                }
              />
            ))}
          </Grid>
        </div>

        {/* Partie Droite : Les deux Trophées de Faits d'armes (Records d'infractions) */}
        <Stack gap="xs" className="lg:col-span-5 h-full justify-start">
          {focusCards.map((card) => (
            <StatFocusCard
              key={card.id}
              title={card.title}
              data={card.data}
              icon={card.icon}
              variant={card.variant}
            />
          ))}
        </Stack>
      </Grid>

      <Row justify="center" mt="sm">
        <Button
          to={ROUTES.NAV.STATS}
          variant={BUTTON_VARIANT.GHOST}
          size={BUTTON_SIZE.SMALL}
          className="text-xs text-info-bright hover:underline cursor-pointer"
        >
          {PLAYER_STATS_GENERAL.LINK_ALL}
        </Button>
      </Row>

      <HintModal
        isOpen={activeHint !== null}
        title={activeHint?.title || ''}
        description={activeHint?.description || ''}
        onClose={() => setActiveHint(null)}
      />
    </Stack>
  );
};
