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
} from '../utils/competitionHelper';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { Card } from '../components/UI/Card';

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

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <Link
          to={ROUTES.NAV_DASHBOARD}
          className="inline-flex items-center gap-2 text-gold/50 hover:text-gold transition-colors text-xs font-black uppercase tracking-widest"
        >
          ← Retour au profil
        </Link>

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
            Supprimer la compétition
          </Button>
        ) : (
          <Badge variant="ghost" className="opacity-20 italic">
            Historique protégé
          </Badge>
        )}
      </div>
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">
          {competition.name}
        </h1>
        <p className="text-gold font-mono text-xs tracking-widest opacity-60">
          CODE: {competition.join_code}
        </p>
        <p className="text-white/20 text-[9px] uppercase tracking-tighter font-medium">
          {getDisplayDateText(competition.start_date, competition.end_date)}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <h2 className="text-gold font-black uppercase text-xs tracking-[0.3em] mb-6">
            Classement
          </h2>
          <Leaderboard data={leaderboard || []} onRefresh={refresh} />
          {!competition.is_finished && (
            <InlineEnrollment competition={competition} onRefresh={refresh} />
          )}
        </div>
        {!competition.is_finished && (
          <div className="space-y-6">
            {competition.has_started ? (
              <div className="space-y-6">
                {!isReporting ? (
                  <Button
                    variant="danger"
                    fullWidth
                    size="lg"
                    icon="🚨"
                    onClick={() => setIsReporting(true)}
                  >
                    Dénoncer un adversaire
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
              </div>
            ) : (
              <Card
                variant="dark"
                className="p-4 text-center border-dashed border-gold/20 bg-gold/5"
              >
                <span className="text-2xl block mb-2 animate-pulse">⏳</span>
                <h3 className="text-gold/50 font-black uppercase text-[10px] tracking-[0.2em] mb-1">
                  L'heure de la délation n'a pas sonné
                </h3>
                <p className="text-white font-bold text-sm">
                  Ouverture du tournoi{' '}
                  <span className="text-gold">
                    {getDaysUntilStart(competition.start_date)}
                  </span>
                </p>
              </Card>
            )}
          </div>
        )}

        <div className="lg:col-span-8">
          <h2 className="text-white font-black uppercase text-xs tracking-[0.3em] mb-6">
            Actions
          </h2>
          <ActionTable actions={actions} />
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetailPage;
