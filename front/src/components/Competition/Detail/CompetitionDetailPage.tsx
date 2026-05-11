import {
  Leaderboard,
  ActionTable,
  CompetitionHeader,
  AdminSettings,
  InlineEnrollment,
} from '@/components/Competition';
import { DetailNavigation, ReportingSection } from '@/components/Competition';
import { Text, LoadingScreen, NotFoundState } from '@/components/UI';
import { COMPETITION_UI } from '@/constants';
import { CompetitionProvider } from '@/context/CompetitionProvider';
import { useCompetitionData } from '@/hooks';
import { useParams } from 'react-router-dom';

const CompetitionDetailPage = () => {
  const { code } = useParams<{ code: string }>();
  const { isLoading, isError, competition } = useCompetitionData(code || '');

  if (isLoading) return <LoadingScreen message="Récupération de l'arène..." />;
  if (isError || !competition) {
    return (
      <NotFoundState
        title={COMPETITION_UI.DETAIL.NOT_FOUND}
        message={`La compétition ${code} n'a pas été trouvée.`}
      />
    );
  }

  return (
    <CompetitionProvider code={code!}>
      <main className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
        <DetailNavigation />

        <CompetitionHeader />

        <AdminSettings />

        <ReportingSection />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <section className="lg:col-span-4 space-y-6">
            <header className="flex items-center gap-4 px-1">
              <Text variant="caption" className="whitespace-nowrap font-bold">
                {COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.TITLE}
              </Text>
              <div className="h-px w-full bg-white/5" />
            </header>
            <Leaderboard />
            {!competition.is_finished && <InlineEnrollment />}
          </section>

          <section className="lg:col-span-8 space-y-6">
            <ActionTable />
          </section>
        </div>
      </main>
    </CompetitionProvider>
  );
};

export default CompetitionDetailPage;
