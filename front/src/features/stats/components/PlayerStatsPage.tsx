import {
  MainLayout,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  Stack,
  ICONS,
  HintModal,
  SectionHeader,
  SECTION_HEADER_VARIANT,
  SECTION_HEADER_THEME,
  cn,
} from '@/shared';
import { usePlayerStats } from '@/features/stats/hooks';
import { PLAYER_STATS_GENERAL } from '@/features/stats/constants';
import { StatFocusCard } from './StatFocusCard';
import { StatCard } from './StatCard';
import { CareerPalmares } from './CareerPalmares';

export const PlayerStatsPage = () => {
  const {
    stats,
    categories,
    focusReceived,
    focusReported,
    activeHint,
    setActiveHint,
  } = usePlayerStats();

  if (!stats) return null;

  return (
    <MainLayout
      title={PLAYER_STATS_GENERAL.TITLE}
      subtitle={PLAYER_STATS_GENERAL.SUBTITLE_PAGE}
    >
      <Stack gap="xl" className="max-w-4xl mx-auto w-full px-1">
        {/* En-tête Principal de Carrière */}
        <SectionHeader
          variant={SECTION_HEADER_VARIANT.TITLE}
          colorTheme={SECTION_HEADER_THEME.GOLD}
          title={PLAYER_STATS_GENERAL.TITLE}
          subtitle={PLAYER_STATS_GENERAL.SUBTITLE}
          centered
        />

        {/* SECTION 1 : TOUTES LES GRILLES DE COMPTEURS ET DE RIVALITÉS */}
        <Stack gap="lg" className="w-full">
          {categories.map((cat, index) => {
            // Détermination dynamique de la parité du bloc
            const isEven = cat.metrics.length % 2 === 0;
            let gridClass = isEven ? 'grid-cols-2' : 'grid-cols-3';
            if (isEven && cat.metrics.length === 4)
              gridClass += ' md:grid-cols-4';
            else if (isEven) gridClass += ' md:grid-cols-2';

            return (
              <Stack key={index} gap="xs" className="w-full">
                <Text
                  variant={TEXT_VARIANT.MICRO}
                  colorTheme={TEXT_THEME.MUTED}
                >
                  {cat.title}
                </Text>

                {/* Algorithme de Grille Dynamique selon la règle de Parité */}
                <div className={cn('grid gap-2 w-full', gridClass)}>
                  {cat.metrics.map((m) => (
                    <StatCard
                      key={m.label}
                      metric={m}
                      onClick={
                        m.hint ? () => setActiveHint(m.hint ?? null) : undefined
                      }
                    />
                  ))}
                </div>
              </Stack>
            );
          })}
        </Stack>

        {/* SECTION 2 : FAITS D'ARMES (Positionnée en pleine largeur en bas de page) */}
        <Stack gap="xs" className="w-full border-t border-border-subtle pt-6">
          <Text variant={TEXT_VARIANT.MICRO} colorTheme={TEXT_THEME.MUTED}>
            {PLAYER_STATS_GENERAL.FOCUS.TITLE}
          </Text>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full items-stretch">
            <StatFocusCard
              title={PLAYER_STATS_GENERAL.FOCUS.RECORD}
              data={focusReceived}
              icon={ICONS.MAX_RECEIVED}
              variant="danger"
            />
            <StatFocusCard
              title={PLAYER_STATS_GENERAL.FOCUS.WORST_STAB}
              data={focusReported}
              icon={ICONS.MAX_REPORTED}
              variant="info"
            />
          </div>
        </Stack>

        {/* Palmarès de Carrière Historique */}
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

export default PlayerStatsPage;
