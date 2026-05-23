import {
  MainLayout,
  SectionHeader,
  SECTION_HEADER_VARIANT,
  Grid,
  Stack,
} from '@/shared';
import { useCompetitionContext } from '@/features/competition/context';
import { CompetitionHeader } from './CompetitionHeader';
import { AdminSettings } from '@/features/competition/admin';
import { ReportingSection } from '@/features/competition/reporting';
import { COMPETITION_UI } from '@/features/competition/constants';
import { Leaderboard } from '@/features/competition/leaderboard';
import { InlineEnrollment } from '@/features/competition/enrollment';
import { ActionTable } from '@/features/competition/actions';

export const CompetitionDetailContent = () => {
  const { competition } = useCompetitionContext();

  return (
    <MainLayout title={competition.name} subtitle={competition.name}>
      <CompetitionHeader />
      <AdminSettings />
      <ReportingSection />

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
          {!competition.is_finished && <InlineEnrollment />}
        </Stack>

        <Stack as="section" gap="lg" className="xl:col-span-7">
          <ActionTable />
        </Stack>
      </Grid>
    </MainLayout>
  );
};
