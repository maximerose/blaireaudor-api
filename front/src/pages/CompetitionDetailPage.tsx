import { useParams } from 'react-router-dom';
import { useCompetitionData } from '../hooks/useCompetitionData';
import { LoadingScreen } from '../components/UI/LoadingScreen';
import { Leaderboard } from '../components/Competition/Leaderboard';
import { ActionTable } from '../components/Competition/ActionTable';

const CompetitionDetailPage = () => {
  const { code } = useParams<{ code: string }>();
  const { competition, leaderboard, actions, loading } = useCompetitionData(
    code || '',
  );

  if (loading) return <LoadingScreen message="Récupération du classement..." />;
  if (!competition)
    return <div className="text-white p-10">Compétition non trouvée.</div>;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10 animate-fade-in">
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
