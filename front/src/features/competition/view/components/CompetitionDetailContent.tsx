import { MainLayout, SectionHeader, SECTION_HEADER_VARIANT } from '@/shared';
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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        <section className="xl:col-span-5 space-y-6">
          <SectionHeader
            title={COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.TITLE}
            variant={SECTION_HEADER_VARIANT.DIVIDER}
          />
          <Leaderboard />
          {!competition.is_finished && <InlineEnrollment />}
        </section>

        <section className="xl:col-span-7 space-y-6">
          <ActionTable />
        </section>
      </div>
    </MainLayout>
  );
};
