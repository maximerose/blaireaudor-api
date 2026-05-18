import {
  Leaderboard,
  ActionTable,
  CompetitionHeader,
  AdminSettings,
  InlineEnrollment,
} from '@/components/Competition';
import { ReportingSection } from '@/components/Competition';
import { MainLayout } from '@/components/Layout';
import {
  LoadingScreen,
  NotFoundState,
  SectionHeader,
  SECTION_HEADER_VARIANT,
} from '@/components/UI';
import { COMPETITION_UI, ERRORS } from '@/constants';
import { CompetitionProvider } from '@/context';
import { useCompetitionData } from '@/hooks';
import { useParams } from 'react-router-dom';

export const CompetitionDetailPage = () => {
  const { code } = useParams<{ code: string }>();
  const { isLoading, isError, competition } = useCompetitionData(code || '');

  if (isLoading) return <LoadingScreen message="Récupération de l'arène..." />;
  if (isError || !competition) {
    return (
      <NotFoundState
        title={COMPETITION_UI.DETAIL.NOT_FOUND}
        message={ERRORS.COMPETITION.NOT_FOUND(code ?? '')}
      />
    );
  }

  return (
    <CompetitionProvider code={code!}>
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
    </CompetitionProvider>
  );
};

export default CompetitionDetailPage;
