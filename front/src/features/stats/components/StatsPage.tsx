import {
  MainLayout,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  Grid,
  Stack,
  ICONS,
  HintModal,
  SectionHeader,
  SECTION_HEADER_VARIANT,
  SECTION_HEADER_THEME,
  type GridColumns,
} from '@/shared';
import { useStats } from '@/features/stats/hooks';
import { STATS_UI } from '@/features/stats/constants';
import { StatFocusCard } from './StatFocusCard';
import { StatCard } from './StatCard';
import { CareerPalmares } from './CareerPalmares';

export const StatsPage = () => {
  const { stats, categories, activeHint, setActiveHint } = useStats();

  if (!stats) return null;

  return (
    <MainLayout
      title={STATS_UI.GENERAL.TITLE}
      subtitle={STATS_UI.GENERAL.SUBTITLE_PAGE}
    >
      <Stack gap="xl" className="max-w-4xl mx-auto w-full">
        <SectionHeader
          variant={SECTION_HEADER_VARIANT.TITLE}
          colorTheme={SECTION_HEADER_THEME.GOLD}
          title={STATS_UI.GENERAL.TITLE}
          subtitle={STATS_UI.GENERAL.SUBTITLE}
          centered
        />

        <Grid cols={1} md={12} gap="md" className="w-full items-stretch">
          <Stack gap="md" className="md:col-span-8 justify-between">
            {categories.map((cat) => (
              <Stack key={cat.title} gap="xs" className="w-full">
                <Text
                  variant={TEXT_VARIANT.MICRO}
                  colorTheme={TEXT_THEME.DIMMED}
                  className="pl-1 font-bold italic tracking-wide"
                >
                  {cat.title}
                </Text>

                <Grid
                  cols={cat.metrics.length as GridColumns}
                  gap="xs"
                  className="w-full"
                >
                  {cat.metrics.map((m) => (
                    <StatCard
                      key={m.label}
                      metric={m}
                      onClick={
                        m.hint ? () => setActiveHint(m.hint || null) : undefined
                      }
                    />
                  ))}
                </Grid>
              </Stack>
            ))}
          </Stack>

          <Stack gap="xs" className="md:col-span-4 h-full justify-start">
            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={TEXT_THEME.DIMMED}
              className="pl-1 font-bold italic tracking-wide hidden md:block"
            >
              {STATS_UI.FOCUS.SECTION_TITLE}
            </Text>
            <StatFocusCard
              title={STATS_UI.FOCUS.RECORD}
              data={stats.record}
              icon={ICONS.FIRE}
              variant="danger"
            />
            <div className="mt-1" />
            <StatFocusCard
              title={STATS_UI.FOCUS.WORST_STAB}
              data={stats.worst_stab}
              icon={ICONS.STAB}
              variant="info"
            />
          </Stack>
        </Grid>

        <CareerPalmares />
      </Stack>

      <HintModal
        isOpen={activeHint !== null}
        title={activeHint?.title || ''}
        description={activeHint?.description || ''}
        onClose={() => setActiveHint(null)}
      />
    </MainLayout>
  );
};

export default StatsPage;
