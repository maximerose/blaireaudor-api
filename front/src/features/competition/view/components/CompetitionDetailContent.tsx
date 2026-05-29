import { ActionTable } from '@/features/competition/actions';
import { AdminSettings } from '@/features/competition/admin';
import { COMPETITION_UI } from '@/features/competition/constants';
import { Leaderboard } from '@/features/competition/leaderboard';
import { ReportingSection } from '@/features/competition/reporting';
import {
  Button,
  BUTTON_VARIANT,
  Grid,
  ICONS,
  LoadingScreen,
  MainLayout,
  Row,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Stack,
} from '@/shared';
import { lazy, Suspense } from 'react'; // 🟢 Ajout de lazy et Suspense
import { useCompetitionDetailUI } from '../hooks';
import { CompetitionHeader } from './CompetitionHeader';

const CompetitionStatsTab = lazy(() =>
  import('@/features/stats/components/CompetitionsStatsTab').then((module) => ({
    default: module.CompetitionStatsTab,
  })),
);

export const CompetitionDetailContent = () => {
  const { competition, activeTab, handleTabChange } = useCompetitionDetailUI();

  return (
    <MainLayout title={competition?.name} subtitle={competition?.name}>
      <CompetitionHeader />
      <AdminSettings />
      <ReportingSection />

      <Row
        justify="center"
        gap="sm"
        className="w-full mt-4 bg-surface-base p-1 rounded-xl max-w-sm mx-auto"
      >
        <Button
          variant={
            activeTab === 'leaderboard'
              ? BUTTON_VARIANT.PRIMARY
              : BUTTON_VARIANT.GHOST
          }
          onClick={() => handleTabChange('leaderboard')}
          className="flex-1 rounded-lg"
          size="sm"
          icon={ICONS.RANKING}
        >
          {COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.TITLE}
        </Button>
        <Button
          variant={
            activeTab === 'stats'
              ? BUTTON_VARIANT.PRIMARY
              : BUTTON_VARIANT.GHOST
          }
          onClick={() => handleTabChange('stats')}
          className="flex-1 rounded-lg"
          size="sm"
          icon={ICONS.STATS}
        >
          {COMPETITION_UI.DETAIL.SECTIONS.STATS.TITLE}
        </Button>
      </Row>

      {activeTab === 'leaderboard' ? (
        <Grid cols={1} xl={12} align="start" mt="xl" className="gap-12">
          <Stack as="section" gap="lg" className="xl:col-span-5">
            <SectionHeader
              title={COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.TITLE}
              variant={SECTION_HEADER_VARIANT.DIVIDER}
              badge={COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.NB_PLAYERS(
                competition?.participations?.length || 0,
              )}
            />
            <Leaderboard />
          </Stack>

          <Stack as="section" gap="lg" className="xl:col-span-7">
            <ActionTable />
          </Stack>
        </Grid>
      ) : (
        <Stack mt="xl" className="animate-fade-in">
          <Suspense
            fallback={
              <LoadingScreen
                layout="local"
                message={COMPETITION_UI.DETAIL.SECTIONS.STATS.LOADING_ANALYTICS}
              />
            }
          >
            <CompetitionStatsTab />
          </Suspense>
        </Stack>
      )}
    </MainLayout>
  );
};
