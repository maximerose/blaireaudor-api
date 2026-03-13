import { type Participation } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { Link } from 'react-router-dom';
import {
  getIsFinished,
  getDisplayDateText,
  canRevealScores,
  getCompetitionStatus,
  CompetitionStatus
} from '../../utils/competitionHelper';

interface CompetitionCardProps {
  participation: Participation;
}

export const CompetitionCard = ({ participation }: CompetitionCardProps) => {
  const { competition, score, rank } = participation;

  const isFinished = getIsFinished(competition.end_date);
  const dateText = getDisplayDateText(competition.start_date, competition.end_date);
  const shouldReveal = canRevealScores(competition, isFinished);
  const status = getCompetitionStatus(competition.start_date, competition.end_date);

  const statusConfig = {
    [CompetitionStatus.ACTIVE]: { label: 'En cours', css: 'bg-green-500/20 text-green-500 animate-pulse' },
    [CompetitionStatus.UPCOMING]: { label: 'À venir', css: 'bg-blue-500/20 text-blue-400' },
    [CompetitionStatus.FINISHED]: { label: 'Terminé', css: 'bg-red-500/20 text-red-500' },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="bg-black/40 border border-gold/20 rounded-2xl p-5 hover:border-gold/50 transition-all group shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-gold font-bold text-lg leading-tight uppercase tracking-tight max-w-[25ch] truncate shrink-0" title={competition.name}>
            {competition.name}
          </h3>
          <p className="text-gold/60 text-[10px] mt-1 font-medium">
            {dateText}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-tighter ${currentStatus.css}
            }`}
        >
          {currentStatus.label}
        </span>
      </div>

      <p className="text-gold/30 text-[11px] font-mono tracking-widest uppercase mb-4">
        CODE: {competition.join_code}
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
          {isFinished ? 'Voir le classement' : 'Détails'}
        </Link>
      </div>
    </div>
  );
};
