import {
  ActionTable,
  Leaderboard,
  CompetitionHeader,
  AdminSettings,
  InlineEnrollment,
  ReportingSection,
} from '@/components/Competition';
import { MainLayout, SectionHeader, SECTION_HEADER_VARIANT } from '@/shared';
import { COMPETITION_UI } from '@/constants';
import { useCompetitionContext } from '@/context';

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
