// front/src/components/Dashboard/CompetitionCard.tsx

import { type Participation } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { Link } from 'react-router-dom';

interface CompetitionCardProps {
  participation: Participation;
}

export const CompetitionCard = ({ participation }: CompetitionCardProps) => {
  const { competition, score, rank } = participation;

  const startDate = new Date(competition.start_date);
  const endDate = new Date(competition.end_date);
  const isFinished = endDate < new Date();

  // Formatage des dates en français (ex: 12 juin 2024)
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Condition : on révèle si c'est fini OU si le brouillard est OFF
  const shouldReveal = isFinished || !competition.fog_of_war;

  return (
    <div className="bg-black/40 border border-gold/20 rounded-2xl p-5 hover:border-gold/50 transition-all group shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-gold font-bold text-lg leading-tight uppercase tracking-tight">
            {competition.name}
          </h3>
          {/* 📅 Affichage des dates */}
          <p className="text-gold/60 text-[10px] mt-1 font-medium">
            Du {formatDate(startDate)} au {formatDate(endDate)}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-tighter ${
            isFinished
              ? 'bg-red-500/20 text-red-500'
              : 'bg-green-500/20 text-green-500 animate-pulse'
          }`}
        >
          {isFinished ? 'Terminé' : 'En cours'}
        </span>
      </div>

      <p className="text-gold/30 text-[9px] font-mono tracking-widest uppercase mb-4">
        ID: {competition.join_code}
      </p>

      <div className="flex items-end justify-between mt-4">
        <div className="flex flex-col gap-1">
          <span className="text-gold/30 text-[10px] uppercase font-semibold italic tracking-wider">
            {shouldReveal ? 'Résultats finaux' : 'Statut actuel'}
          </span>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-black text-gold">
              {shouldReveal ? (
                score
              ) : (
                <span className="opacity-30 italic text-sm font-medium">
                  Score masqué 🌫️
                </span>
              )}
            </span>

            {shouldReveal && rank && (
              <span className="text-sm font-bold text-white/80 bg-gold/20 px-2 py-0.5 rounded border border-gold/30">
                {rank}
                {rank === 1 ? 'er' : 'ème'}
              </span>
            )}
          </div>
        </div>

        <Link
          to={`${ROUTES.DASHBOARD}/${competition.join_code}`}
          className="bg-gold text-dark text-[10px] font-black px-4 py-2 rounded-lg hover:bg-white transition-colors uppercase tracking-widest shadow-md"
        >
          {isFinished ? 'Voir le classement' : 'Participer'}
        </Link>
      </div>
    </div>
  );
};
