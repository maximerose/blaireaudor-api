import {
  Grid,
  Stack,
  Button,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  ROUTES,
  Row,
  HintModal,
  SectionHeader,
  SECTION_HEADER_VARIANT,
  SECTION_HEADER_THEME,
} from '@/shared';
import { StatCard } from './StatCard';
import { STATS_UI } from '@/features/stats/constants';
import { useStats } from '@/features/stats/hooks';

export const DashboardStats = () => {
  const { stats, teaserMetrics, activeHint, setActiveHint } = useStats();

  if (!stats || teaserMetrics.length === 0) return null;

  return (
    <Stack gap="md" className="w-full animate-fade-in">
      <SectionHeader
        variant={SECTION_HEADER_VARIANT.DIVIDER}
        colorTheme={SECTION_HEADER_THEME.GOLD}
        title={STATS_UI.GENERAL.TITLE}
      />

      <Grid cols={3} gap="xs" className="w-full">
        {teaserMetrics.map((m) => (
          <StatCard
            key={m.label}
            metric={m}
            onClick={m.hint ? () => setActiveHint(m.hint || null) : undefined}
          />
        ))}
      </Grid>

      <Row justify="center" mt="sm">
        <Button
          to={ROUTES.NAV.STATS}
          variant={BUTTON_VARIANT.GHOST}
          size={BUTTON_SIZE.SMALL}
          className="text-[11px] text-info-bright hover:underline cursor-pointer"
        >
          {STATS_UI.GENERAL.LINK_ALL}
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
