import { Link, useParams } from 'react-router-dom';
import { useCompetitionData } from '../hooks/useCompetitionData';
import { LoadingScreen } from '../components/UI/LoadingScreen';
import { Leaderboard } from '../components/Competition/Leaderboard';
import { ActionTable } from '../components/Competition/ActionTable';
import { ROUTES } from '../constants/routes';
import { useCompetitionDelete } from '../hooks/useCompetitionDelete';
import { InlineEnrollment } from '../components/Competition/InlineEnrollment';

const CompetitionDetailPage = () => {
  const { code } = useParams<{ code: string }>();
  const { competition, leaderboard, actions, loading, refresh } =
    useCompetitionData(code || '');
  const { deleteCompetition } = useCompetitionDelete();

  if (loading) return <LoadingScreen message="Récupération du classement..." />;
  if (!competition)
    return <div className="text-white p-10">Compétition non trouvée.</div>;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <Link
          to={ROUTES.DASHBOARD}
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
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <h2 className="text-gold font-black uppercase text-xs tracking-[0.3em] mb-6 border-l-2 border-gold pl-3">
            Leaderboard
          </h2>
          <Leaderboard data={leaderboard || []} />
          <InlineEnrollment competition={competition} onRefresh={refresh} />
        </div>

        <div className="lg:col-span-8">
          <h2 className="text-white font-black uppercase text-xs tracking-[0.3em] mb-6 border-l-2 border-white pl-3">
            Actions
          </h2>
          <ActionTable actions={actions} />
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetailPage;
