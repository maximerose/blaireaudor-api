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
import { getDisplayDateText } from '../utils/competitionHelper';

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
          <button
            onClick={() =>
              deleteCompetition(
                competition.id,
                competition.name,
                actions?.length || 0,
              )
            }
            className="text-red-500/20 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-[0.2em] border border-red-500/10 hover:border-red-500/50 px-3 py-1.5 rounded-lg"
          >
            Supprimer la compétition
          </button>
        ) : (
          <span className="text-[9px] font-black uppercase tracking-widest text-white/10 italic">
            Historique protégé
          </span>
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
            {!isReporting ? (
              <button
                onClick={() => setIsReporting(true)}
                className="w-full bg-red-600/10 border border-red-500/20 text-red-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all group"
              >
                🚨 Dénoncer un adversaire
              </button>
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
