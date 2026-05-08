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
import { useCompetitionDetailUI, useCompetitionAdmin } from '@/hooks';

const CompetitionDetailPage = () => {
  const {
    competition,
    leaderboard,
    isReady,
    isRefreshing,
    refresh,
    deleteCompetition,
    isReferee,
    isCreator,
    creatorName,
  } = useCompetitionDetailUI();

  const { handleActionStatus, handleUpdate } = useCompetitionAdmin(competition);

  if (!isReady) return <LoadingScreen message="Récupération de l'arène..." />;
  if (!competition)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Text variant="h2" className="text-white/50">
          {COMPETITION_UI.DETAIL.NOT_FOUND}
        </Text>
      </div>
    );

  const isFogActive = competition.fog_of_war && !isReferee;

  return (
    <CompetitionProvider
      competition={competition}
      isAdmin={isReferee}
      hidePoints={isFogActive}
      refresh={refresh}
    >
      {isRefreshing && (
        <div className="fixed top-4 right-4 animate-pulse text-[10px] text-white/40 uppercase tracking-widest">
          {COMPETITION_UI.DETAIL.SYNCING}
        </div>
      )}
      <main className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
        <DetailNavigation
          competition={competition}
          hasActions={true}
          isCreator={isCreator}
          onDelete={deleteCompetition}
        />

        <CompetitionHeader
          competition={competition}
          creatorName={creatorName}
        />

        {(isReferee || isCreator) && !competition.is_finished && (
          <AdminSettings competition={competition} />
        )}

        <ReportingSection
          competition={competition}
          leaderboard={leaderboard}
          isReferee={isReferee}
          refresh={refresh}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <section className="lg:col-span-4 space-y-6">
            <header className="flex items-center gap-4 px-1">
              <Text variant="caption" className="whitespace-nowrap font-bold">
                {COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.TITLE}
              </Text>
              <div className="h-px w-full bg-white/5" />
            </header>
            <Leaderboard
              participations={leaderboard || []}
              competition={competition}
              onRefresh={refresh}
            />
            {!competition.is_finished && (
              <InlineEnrollment onRefresh={refresh} />
            )}
          </section>

          <section className="lg:col-span-8 space-y-6">
            <ActionTable
              onUpdate={handleUpdate}
              onStatusChange={handleActionStatus}
            />
          </section>
        </div>
      </main>
    </CompetitionProvider>
  );
};

export default CompetitionDetailPage;
