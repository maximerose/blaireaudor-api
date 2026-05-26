import {
  Stack,
  Alert,
  HintModal,
  LoadingScreen,
  Text,
  TEXT_VARIANT,
  ICONS,
} from '@/shared';
import { COMPETITION_STATS_GENERAL } from '@/features/stats/constants';
import { CompetitionProgressBanner } from './CompetitionProgressBanner';
import { CompetitionAnalyticChart } from './CompetitionAnalyticChart';
import { CompetitionKpiGrid } from './CompetitionKpiGrid';
import { StatFocusCard } from './StatFocusCard';
import { useCompetitionStatsTabUI } from '@/features/stats/hooks';

export const CompetitionStatsTab = () => {
  const {
    canViewStats,
    isLoading,
    bumpData,
    dailyEvolution,
    leaderboard,
    myPlayerId,
    myParticipation,
    activeHint,
    setActiveHint,
    hiddenLines,
    handleLegendClick,
    activeFilter,
    handleFilterChange,
    isFullscreen,
    openFullscreenLandscape,
    closeFullscreenLandscape,
    categories,
    maxSingleActionMapped,
  } = useCompetitionStatsTabUI();

  if (!canViewStats)
    return (
      <Alert variant="warning" title="Brouillard actif">
        {COMPETITION_STATS_GENERAL.CHART.FOG_WARNING}
      </Alert>
    );
  if (isLoading)
    return (
      <LoadingScreen layout="local" message="Analyse des données en cours..." />
    );
  if (bumpData.length === 0)
    return (
      <Stack
        align="center"
        justify="center"
        p="xl"
        className="opacity-50 animate-fade-in"
      >
        <span className="text-4xl mb-4" aria-hidden="true">
          {ICONS.EMPTY}
        </span>
        <Text variant={TEXT_VARIANT.BODY}>
          {COMPETITION_STATS_GENERAL.CHART.EMPTY}
        </Text>
      </Stack>
    );

  return (
    <Stack gap="xl" className="w-full animate-slide-up px-1 pb-10">
      {myParticipation && (
        <CompetitionProgressBanner
          myParticipation={myParticipation}
          leaderboard={leaderboard}
          myPlayerId={myPlayerId}
        />
      )}

      <CompetitionAnalyticChart
        bumpData={bumpData}
        dailyEvolution={dailyEvolution}
        leaderboard={leaderboard}
        myPlayerId={myPlayerId}
        hiddenLines={hiddenLines}
        onLegendClick={handleLegendClick}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        isFullscreen={isFullscreen}
        onOpenFullscreen={openFullscreenLandscape}
        onCloseFullscreen={closeFullscreenLandscape}
      />

      <CompetitionKpiGrid
        categories={categories}
        onCardClick={(hint) => setActiveHint(hint)}
      />

      <Stack gap="xs" className="w-full border-t border-border-subtle pt-6">
        <Text
          variant={TEXT_VARIANT.MICRO}
          className="pl-2 font-black italic tracking-widest uppercase opacity-40 mb-1"
        >
          {COMPETITION_STATS_GENERAL.FOCUS.SECTION_TITLE}
        </Text>
        <StatFocusCard
          title={COMPETITION_STATS_GENERAL.FOCUS.RECORD}
          data={maxSingleActionMapped}
          icon={ICONS.FIRE}
          variant="danger"
        />
      </Stack>

      <HintModal
        isOpen={activeHint !== null}
        title={activeHint?.title || ''}
        description={activeHint?.description || ''}
        onClose={() => setActiveHint(null)}
      />
    </Stack>
  );
};
