import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CompetitionCard } from './Dashboard/CompetitionCard';
import { Navbar } from './UI/Navbar';
import { ROUTES } from '../constants/routes';
import { CompetitionStatus, getCompetitionStatus, getStatusWeight } from '../utils/competitionHelper';
import { Button } from './UI/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const participations = user?.player?.participations || [];
  const stats = participations.reduce((acc, p) => {
    const status = getCompetitionStatus(p.competition.start_date, p.competition.end_date);
    if (status === CompetitionStatus.ACTIVE) acc.active++;
    if (status === CompetitionStatus.FINISHED) acc.finished++;
    if (status === CompetitionStatus.UPCOMING) acc.upcoming++;
    return acc;
  }, { active: 0, finished: 0, upcoming: 0 });

  const sortedParticipations = [...participations].sort((a, b) => {
    const weightA = getStatusWeight(getCompetitionStatus(a.competition.start_date, a.competition.end_date));
    const weightB = getStatusWeight(getCompetitionStatus(b.competition.start_date, b.competition.end_date));

    if (weightA !== weightB) return weightA - weightB;
    return new Date(a.competition.start_date).getTime() - new Date(b.competition.start_date).getTime();
  });

  const getStatusMessage = () => {
    if (participations.length === 0) return "Tu n'as pas encore rejoint de concours.";

    const parts = [];
    if (stats.active > 0) parts.push(`${stats.active} en cours`);
    if (stats.upcoming > 0) parts.push(`${stats.upcoming} à venir`);
    if (stats.finished > 0) parts.push(`${stats.finished} terminée${stats.finished > 1 ? 's' : ''}`);

    return `Tu as ${participations.length} participation${participations.length > 1 ? 's' : ''} au total : ${parts.join(', ')}.`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen flex flex-col p-4">
      <Navbar />

      <div className="flex-1 space-y-8 animate-fade-in">
        <section className="text-center py-4">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Salut,{' '}
            <span className="text-gold">{user?.player?.display_name}</span> !
          </h2>
          <p className="text-gold/50 text-xs mt-2 uppercase tracking-widest">
            {getStatusMessage()}
          </p>
        </section>

        <section className="grid gap-4">
          {participations.length > 0 ? (
            sortedParticipations.map(
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

        <section className="grid gap-4">
          <Button
            onClick={() => navigate(ROUTES.CREATE_COMPETITION)}
            fullWidth
          >
            + Créer une compétition
          </Button>
          <Button
            className="bg-gold/5 border border-gold/20 text-gold py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gold/10 transition-all">
            + Rejoindre une compétition
          </Button>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
