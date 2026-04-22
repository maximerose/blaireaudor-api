import { Link, useParams } from 'react-router-dom';
import { useCompetitionData } from '../hooks/useCompetitionData';
import { LoadingScreen } from '../components/UI/LoadingScreen';
import { Leaderboard } from '../components/Competition/Leaderboard';
import { ActionTable } from '../components/Competition/ActionTable';
import { ROUTES } from '../constants/routes';
import { useCompetitionDelete } from '../hooks/useCompetitionDelete';
import { InlineEnrollment } from '../components/Competition/InlineEnrollment';
import { ReportActionForm } from '../components/Competition/ReportActionForm';
import { useMemo, useState } from 'react';
import { useReportDateLimits } from '../hooks/useReportDateLimits';
import {
  getDisplayDateText,
  getDaysUntilStart,
  getTimeRemaining,
  getIsUrgent,
} from '../utils/competitionHelper';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { Card } from '../components/UI/Card';
import { Text } from '../components/UI/Typography';

const CompetitionDetailPage = () => {
  const { code } = useParams<{ code: string }>();
  const { competition, leaderboard, actions, loading, refresh } =
    useCompetitionData(code || '');
  const { deleteCompetition } = useCompetitionDelete();
  const [isReporting, setIsReporting] = useState(false);
  const { minDate, maxDate } = useReportDateLimits(competition);

  const potentialTargets = useMemo(
    () =>
      leaderboard?.map((item) => ({
        id: item.player.id,
        display_name: item.player.display_name,
      })) || [],
    [leaderboard],
  );

  if (loading) return <LoadingScreen message="Récupération du classement..." />;
  if (!competition)
    return <div className="text-white p-10">Compétition non trouvée.</div>;

  const timeRemaining = getTimeRemaining(competition.end_date);
  const isUrgent = getIsUrgent(competition.end_date);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
      <div className="mb-10 flex justify-between items-center">
        <Button as={Link} to={ROUTES.NAV_DASHBOARD} variant="ghost" size="sm">
          ← Retour
        </Button>

        {!actions || actions.length === 0 ? (
          <Button
            variant="danger"
            size="sm"
            onClick={() =>
              deleteCompetition(
                competition.id,
                competition.name,
                actions?.length || 0,
              )
            }
          >
            Supprimer l'arène
          </Button>
        ) : (
          <Badge variant="ghost" className="opacity-70 italic text-[8px]">
            Historique protégé
          </Badge>
        )}
      </div>

      <header className="mb-10 text-center space-y-2">
        <Text variant="h1" className="text-3xl sm:text-5xl">
          {competition.name}
        </Text>
        <div className="flex flex-col items-center gap-1">
          <Text
            variant="mono"
            className="text-gold/50 tracking-[0.4em] uppercase text-sm"
          >
            CODE : {competition.join_code}
          </Text>

          <Text variant="caption" className="opacity-60">
            {getDisplayDateText(competition.start_date, competition.end_date)}
          </Text>

          {competition.has_started && timeRemaining && (
            <div className="mt-1">
              <span className="text-sm font-black uppercase tracking-widest text-white/30 italic">
                Termine{' '}
              </span>
              <span
                className={`text-sm font-black uppercase tracking-widest ${isUrgent ? 'text-danger animate-pulse' : 'text-gold'}`}
              >
                {timeRemaining}
              </span>
            </div>
          )}
        </div>
      </header>

      {!competition.is_finished && (
        <section className="mb-10 max-w-2xl mx-auto animate-slide-up">
          {competition.has_started ? (
            <>
              {!isReporting ? (
                <Button
                  variant="danger"
                  fullWidth
                  size="md"
                  className="shadow-2xl shadow-danger/10 border border-danger/20 group hover:scale-[1.02] transition-transform"
                  onClick={() => setIsReporting(true)}
                >
                  <span className="text-xl mr-4 group-hover:animate-bounce">
                    🚨
                  </span>
                  <span className="tracking-widest">
                    Dénoncer un adversaire
                  </span>
                </Button>
              ) : (
                <ReportActionForm
                  competitionId={competition.id}
                  players={potentialTargets}
                  minDate={minDate}
                  maxDate={maxDate}
                  onCancel={() => setIsReporting(false)}
                  onSuccess={() => {
                    setIsReporting(false);
                    refresh();
                  }}
                />
              )}
            </>
          ) : (
            <Card
              variant="dark"
              className="text-center p-4 border-dashed border-gold/10 bg-gold/2 max-w-md mx-auto"
            >
              <Text
                variant="h2"
                className="text-gold/30 lowercase italic font-medium"
              >
                l'heure de la délation n'a pas sonné...
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
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-4 px-1">
            <Text variant="caption" className="whitespace-nowrap">
              Classement
            </Text>
            <div className="h-px w-full bg-white/5" />
          </div>
          <Leaderboard
            data={leaderboard || []}
            competition={competition}
            onRefresh={refresh}
          />

          {!competition.is_finished && (
            <div className="mt-6">
              <InlineEnrollment competition={competition} onRefresh={refresh} />
            </div>
          )}
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-4 px-1">
            <Text variant="caption" className="whitespace-nowrap">
              Journal des actions
            </Text>
            <div className="h-px w-full bg-white/5" />
            <Badge variant="ghost" className="opacity-60 text-[8px]">
              {actions?.length || 0} entrées
            </Badge>
          </div>
          <ActionTable actions={actions || []} />
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetailPage;
