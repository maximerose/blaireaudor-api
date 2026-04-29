import {
  Leaderboard,
  ActionTable,
  CompetitionHeader,
  AdminSettings,
  InlineEnrollment,
} from '@/components/Competition';
import { DetailNavigation } from './DetailNavigation';
import { ReportingSection } from '../Reporting/ReportingSection';
import { Badge, Text, LoadingScreen } from '@/components/UI';
import { useCompetitionDetailUI, useCompetitionAdmin } from '@/hooks';

const CompetitionDetailPage = () => {
  const {
    competition,
    leaderboard,
    actions,
    loading,
    refresh,
    deleteCompetition,
    isReferee,
    isCreator,
    creatorName,
  } = useCompetitionDetailUI();

  const { handleActionStatus, updateAction } = useCompetitionAdmin(
    competition?.id,
    refresh,
  );

  if (loading) return <LoadingScreen message="Récupération de l'arène..." />;
  if (!competition)
    return <div className="text-white p-10">Compétition non trouvée.</div>;

  const isFogActive = competition.fog_of_war && !isReferee;
  const hasActions = actions && actions.length > 0;

  return (
    <main className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
      <DetailNavigation
        competition={competition}
        hasActions={hasActions}
        isCreator={isCreator}
        onDelete={deleteCompetition}
      />

      <CompetitionHeader competition={competition} creatorName={creatorName} />

      {(isReferee || isCreator) && !competition.is_finished && (
        <AdminSettings
          competition={competition}
          actions={actions}
          refresh={refresh}
        />
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
              Classement
            </Text>
            <div className="h-px w-full bg-white/5" />
          </header>
          <Leaderboard
            data={leaderboard || []}
            competition={competition}
            onRefresh={refresh}
          />
          {!competition.is_finished && (
            <InlineEnrollment competition={competition} onRefresh={refresh} />
          )}
        </section>

        <section className="lg:col-span-8 space-y-6">
          <header className="flex items-center gap-4 px-1">
            <Text variant="caption" className="whitespace-nowrap font-bold">
              Journal des actions
            </Text>
            <div className="h-px w-full bg-white/5" />
            <Badge variant="ghost" className="opacity-60 text-[8px]">
              {isReferee
                ? actions?.length
                : actions?.filter((a) => a.status !== 'rejected').length}{' '}
              entrées
            </Badge>
          </header>
          <ActionTable
            actions={actions || []}
            isAdmin={isReferee}
            hidePoints={isFogActive}
            onUpdate={updateAction}
            onStatusChange={handleActionStatus}
          />
        </section>
      </div>
    </main>
  );
};

export default CompetitionDetailPage;
