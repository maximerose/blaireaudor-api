import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CompetitionCard } from './Dashboard/CompetitionCard';
import { Navbar } from './UI/Navbar';
import { ROUTES } from '../constants/routes';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const participations = user?.player?.participations || [];
  const now = new Date();
  const activeParticipations = participations.filter(
    (p) => !p.competition.end_date || new Date(p.competition.end_date) >= now,
  );

  const finishedParticipations = participations.filter(
    (p) => p.competition.end_date && new Date(p.competition.end_date) < now,
  );

  const getStatusMessage = () => {
    if (participations.length === 0)
      return "Tu n'as pas encore rejoint de concours.";

    const parts = [];
    if (activeParticipations.length > 0) {
      parts.push(`${activeParticipations.length} en cours`);
    }
    if (finishedParticipations.length > 0) {
      parts.push(
        `${finishedParticipations.length} terminée${finishedParticipations.length > 1 ? 's' : ''}`,
      );
    }

    return `Tu as ${participations.length} participation${participations.length > 1 ? 's' : ''} au total : ${parts.join(' et ')}.`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen flex flex-col p-4">
      <Navbar />

      <div className="flex-1 space-y-8 animate-fade-in">
        {/* Header Section */}
        <section className="text-center py-4">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Salut,{' '}
            <span className="text-gold">{user?.player?.display_name}</span> !
          </h2>
          <p className="text-gold/50 text-xs mt-2 uppercase tracking-widest">
            {getStatusMessage()}
          </p>
        </section>

        {/* Grille des compétitions */}
        <section className="grid gap-4">
          {participations.length > 0 ? (
            [...activeParticipations, ...finishedParticipations].map(
              (p, idx) => <CompetitionCard key={idx} participation={p} />,
            )
          ) : (
            <div className="text-center p-12 border-2 border-dashed border-gold/10 rounded-3xl">
              <p className="text-gold/30 italic text-sm">
                C'est bien calme ici... trop calme.
              </p>
            </div>
          )}
        </section>

        {/* Action Buttons */}
        <section className="grid gap-4">
          <button
            onClick={() => navigate(ROUTES.CREATE_COMPETITION)}
            className="bg-gold/5 border border-gold/20 text-gold py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gold/10 transition-all">
            + Créer une compétition
          </button>
          <button
            className="bg-gold/5 border border-gold/20 text-gold py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gold/10 transition-all">
            + Rejoindre une compétition
          </button>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
