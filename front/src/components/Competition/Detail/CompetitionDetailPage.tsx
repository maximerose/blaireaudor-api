import {
  Leaderboard,
  ActionTable,
  CompetitionHeader,
  AdminSettings,
  InlineEnrollment,
} from '@/components/Competition';
import { DetailNavigation, ReportingSection } from '@/components/Competition';
import { Text, LoadingScreen } from '@/components/UI';
import { COMPETITION_UI } from '@/constants';
import { CompetitionProvider } from '@/context/CompetitionProvider';
import { useCompetitionData } from '@/hooks';
import { useParams } from 'react-router-dom';

const CompetitionDetailPage = () => {
  const { code } = useParams<{ code: string }>();
  const { isReady, competition } = useCompetitionData(code || '');

  if (!isReady) return <LoadingScreen message="Récupération de l'arène..." />;
  if (!competition)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Text variant="h2" className="text-white/50">
          {COMPETITION_UI.DETAIL.NOT_FOUND}
        </Text>
      </div>
    );

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
