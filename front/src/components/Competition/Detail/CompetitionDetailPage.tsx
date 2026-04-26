import { ROUTES } from '@/constants/routes';
import {
  InlineEnrollment,
  Leaderboard,
  ActionTable,
  ReportActionForm,
  CompetitionHeader,
  AdminSettings,
} from '@/components/Competition';
import { getDaysUntilStart } from '@/utils';
import { Button, Badge, Card, Text, LoadingScreen } from '@/components/UI';
import { useCompetitionDetailUI, useCompetitionAdmin } from '@/hooks';

const CompetitionDetailPage = () => {
  const {
    competition,
    leaderboard,
    actions,
    loading,
    refresh,
    deleteCompetition,
    isReporting,
    setIsReporting,
    potentialTargets,
    minDate,
    maxDate,
    timeRemaining,
    isUrgent,
    isReferee,
  } = useCompetitionDetailUI();

  const { handleActionStatus, updateAction, updateCompetition, isUpdating } =
    useCompetitionAdmin(competition?.id, refresh);
  const pendingCount =
    actions?.filter((a) => a.status === 'pending').length || 0;

  if (loading) return <LoadingScreen message="Récupération de l'arène..." />;
  if (!competition)
    return <div className="text-white p-10">Compétition non trouvée.</div>;

  const isFogActive = competition.fog_of_war && !isReferee;

  return (
    <main className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
      <nav className="mb-10 flex justify-between items-center">
        <Button to={ROUTES.NAV_DASHBOARD} variant="ghost" size="sm">
          <span aria-hidden="true">← </span>Retour
        </Button>

        {!actions || actions.length === 0 ? (
          <Button
            variant="danger"
            size="sm"
            onClick={() =>
              deleteCompetition(competition.id, competition.name, 0)
            }
          >
            Supprimer l'arène
          </Button>
        ) : (
          <Badge variant="ghost" className="opacity-70 italic text-[8px]">
            Historique protégé
          </Badge>
        )}
      </nav>

      {isReferee && !competition.is_finished && (
        <AdminSettings
          competition={competition}
          onUpdate={updateCompetition}
          isLoading={isUpdating}
          pendingCount={pendingCount}
        />
      )}

      <CompetitionHeader
        name={competition.name}
        joinCode={competition.join_code}
        startDate={competition.start_date}
        endDate={competition.end_date}
        hasStarted={competition.has_started}
        timeRemaining={timeRemaining}
        isUrgent={isUrgent}
      />

      {!competition.is_finished && (
        <section className="mb-10 max-w-2xl mx-auto animate-slide-up">
          {competition.has_started ? (
            !isReporting ? (
              <Button
                variant="danger"
                fullWidth
                size="md"
                className="group"
                onClick={() => setIsReporting(true)}
              >
                <span className="text-xl mr-4 group-hover:animate-bounce">
                  🚨
                </span>
                <span className="tracking-widest">Dénoncer un adversaire</span>
              </Button>
            ) : (
              <ReportActionForm
                competitionId={competition.id}
                players={potentialTargets}
                minDate={minDate}
                maxDate={maxDate}
                isAdmin={isReferee}
                onCancel={() => setIsReporting(false)}
                onSuccess={() => {
                  setIsReporting(false);
                  refresh();
                }}
              />
            )
          ) : (
            <Card
              variant="dark"
              className="text-center p-4 border-dashed border-gold/10 max-w-md mx-auto"
            >
              <Text variant="h2" className="text-gold/30 italic font-medium">
                L'heure de la délation n'a pas sonné...
              </Text>
              <Text variant="body" className="mt-2 opacity-60">
                Ouverture{' '}
                <span className="text-gold font-bold">
                  {getDaysUntilStart(competition.start_date)}
                </span>
              </Text>
            </Card>
          )}
        </section>
      )}

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
                ? actions?.length || 0
                : actions?.filter((a) => a.status !== 'rejected').length ||
                  0}{' '}
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
