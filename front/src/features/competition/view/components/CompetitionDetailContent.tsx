import {
  MainLayout,
  SectionHeader,
  SECTION_HEADER_VARIANT,
  Grid,
  Stack,
  Row,
  Button,
  BUTTON_VARIANT,
  ICONS,
} from '@/shared';
import { useCompetitionContext } from '@/features/competition/context';
import { CompetitionHeader } from './CompetitionHeader';
import { AdminSettings } from '@/features/competition/admin';
import { ReportingSection } from '@/features/competition/reporting';
import { COMPETITION_UI } from '@/features/competition/constants';
import { Leaderboard } from '@/features/competition/leaderboard';
import { ActionTable } from '@/features/competition/actions';
import { useState } from 'react';
import { CompetitionStatsTab } from '@/features/stats/components';

export const CompetitionDetailContent = () => {
  const { competition } = useCompetitionContext();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'stats'>(
    'leaderboard',
  );
  return (
    <MainLayout title={competition.name} subtitle={competition.name}>
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
          onClick={() => setActiveTab('leaderboard')}
          className="flex-1 rounded-lg"
          size="sm"
          icon={ICONS.FLAG}
        >
          Classement
        </Button>
        <Button
          variant={
            activeTab === 'stats'
              ? BUTTON_VARIANT.PRIMARY
              : BUTTON_VARIANT.GHOST
          }
          onClick={() => setActiveTab('stats')}
          className="flex-1 rounded-lg"
          size="sm"
          icon={ICONS.POINTS}
        >
          Analyses
        </Button>
      </Row>

      {activeTab === 'leaderboard' ? (
        <Grid cols={1} xl={12} align="start" mt="xl" className="gap-12">
          <Stack as="section" gap="lg" className="xl:col-span-5">
            <SectionHeader
              title={COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.TITLE}
              variant={SECTION_HEADER_VARIANT.DIVIDER}
              badge={COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.NB_PLAYERS(
                competition.participations?.length || 0,
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
          <CompetitionStatsTab />
        </Stack>
      )}
    </MainLayout>
  );
};
