import {
  Card,
  CARD_VARIANT,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  Grid,
  Stack,
  Button,
  BUTTON_VARIANT,
  ICONS,
  BUTTONS,
} from '@/shared';
import { DASHBOARD_UI } from '../constants';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { StatCard } from './StatCard';
import { DashboardFocusCard } from './DashboardFocusCard';

export const DashboardStats = () => {
  const { stats, categories, activeHint, setActiveHint } = useDashboardStats();

  if (!stats) return null;

  return (
    <Stack gap="sm" className="w-full animate-fade-in">
      <Text
        variant={TEXT_VARIANT.CAPTION}
        colorTheme={TEXT_THEME.GOLD}
        className="pl-1 font-black"
      >
        {DASHBOARD_UI.STATS_PANEL.TITLE}
      </Text>

      <Grid cols={1} xl={12} gap="sm" className="w-full items-stretch">
        <Stack gap="md" className="xl:col-span-8 justify-between">
          {categories.map((cat) => (
            <Stack key={cat.title} gap="xs" className="w-full">
              <Text
                variant={TEXT_VARIANT.MICRO}
                colorTheme={TEXT_THEME.DIMMED}
                className="pl-1 font-bold italic tracking-wide"
              >
                {cat.title}
              </Text>

              <Grid cols={3} gap="xs" className="w-full">
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

        <Stack gap="xs" className="xl:col-span-4 h-full justify-evenly">
          <DashboardFocusCard
            title={DASHBOARD_UI.STATS_PANEL.FOCUS.RECORD}
            data={stats.record}
            icon={ICONS.FIRE}
            variant="danger"
          />

          <DashboardFocusCard
            title={DASHBOARD_UI.STATS_PANEL.FOCUS.WORST_STAB}
            data={stats.worst_stab}
            icon={ICONS.STAB}
            variant="info"
          />
        </Stack>
      </Grid>

      {activeHint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveHint(null)}
        >
          <div
            className="w-full max-w-sm animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <Card
              variant={CARD_VARIANT.DARK}
              className="shadow-modal-gold border-gold/20"
            >
              <Card.Body p="lg" gap="md" align="center">
                <Text
                  variant={TEXT_VARIANT.H2}
                  colorTheme={TEXT_THEME.GOLD}
                  className="italic text-center"
                >
                  {activeHint.title}
                </Text>
                <Text
                  variant={TEXT_VARIANT.BODY}
                  colorTheme={TEXT_THEME.MUTED}
                  className="text-center text-xs leading-relaxed"
                >
                  {activeHint.description}
                </Text>
                <Button
                  fullWidth
                  variant={BUTTON_VARIANT.SECONDARY}
                  onClick={() => setActiveHint(null)}
                  className="mt-2"
                >
                  {BUTTONS.CLOSE}
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
    </Stack>
  );
};
