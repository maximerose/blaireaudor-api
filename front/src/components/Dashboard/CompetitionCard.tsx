import { type Participation } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { Link } from 'react-router-dom';
import {
  getIsFinished,
  getDisplayDateText,
  canRevealScores,
  getCompetitionStatus,
  CompetitionStatus,
} from '../../utils/competitionHelper';

interface CompetitionCardProps {
  participation: Participation;
}

export const CompetitionCard = ({ participation }: CompetitionCardProps) => {
  const { competition, score, rank } = participation;

  const isFinished = getIsFinished(competition.end_date);
  const dateText = getDisplayDateText(
    competition.start_date,
    competition.end_date,
  );
  const shouldReveal = canRevealScores(competition, isFinished);
  const status = getCompetitionStatus(
    competition.start_date,
    competition.end_date,
  );

  const statusConfig = {
    [CompetitionStatus.ACTIVE]: {
      label: 'En cours',
      css: 'bg-green-500/20 text-green-500 animate-pulse',
    },
    [CompetitionStatus.UPCOMING]: {
      label: 'À venir',
      css: 'bg-blue-500/20 text-blue-400',
    },
    [CompetitionStatus.FINISHED]: {
      label: 'Terminé',
      css: 'bg-red-500/20 text-red-500',
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="bg-black/40 border border-gold/20 rounded-2xl p-4 sm:p-5 hover:border-gold/50 transition-all group shadow-lg flex flex-col h-full">
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3
            className="text-gold font-black text-base sm:text-lg leading-tight uppercase tracking-tight truncate"
            title={competition.name}
          >
            {competition.name}
          </h3>
          <p className="text-gold/60 text-[9px] sm:text-[10px] mt-1 font-medium uppercase tracking-tighter">
            {dateText}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-tighter shrink-0 ${currentStatus.css}`}
        >
          {currentStatus.label}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-y-2 mb-4">
        <p className="text-gold/30 text-[9px] sm:text-[11px] font-mono tracking-widest uppercase">
          CODE: {competition.join_code}
        </p>

        <div className="flex items-center gap-1.5 bg-white/3 px-2 py-0.5 rounded-full border border-white/5">
          <div
            className={`w-1 h-1 rounded-full ${competition.participants_count === 0 ? 'bg-red-500' : 'bg-gold/40'}`}
          />
          <span
            className={`text-[9px] font-bold uppercase tracking-widest ${
              competition.participants_count === 0
                ? 'text-red-500/50'
                : 'text-white/30'
            }`}
          >
            {competition.participants_count === 0
              ? 'Vide'
              : `${competition.participants_count} ${competition.participants_count > 1 ? 'Joueurs' : 'Joueur'}`}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-gold/30 text-[8px] sm:text-[10px] uppercase font-black italic tracking-widest">
            {shouldReveal ? 'Résultats finaux' : 'Statut actuel'}
          </span>

          <div className="flex items-baseline justify-between">
            {shouldReveal ? (
              <>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-white leading-none mr-2">
                    {score}
                  </span>
                  <span className="text-[10px] font-black uppercase text-white/20 tracking-tighter">
                    pts
                  </span>
                </div>
                {rank && (
                  <span className="ml-2 text-xs font-black text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                    {rank}
                    {rank === 1 ? 'er' : 'ème'}
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs sm:text-sm opacity-30 italic font-bold text-white uppercase tracking-tight">
                Score masqué 🌫️
              </span>
            )}
          </div>
        </div>

        <Link
          to={ROUTES.NAV_COMPETITION_DETAIL(competition.join_code)}
          className={`
            text-center text-[10px] font-black px-4 py-3 sm:py-2 rounded-xl transition-all uppercase tracking-widest shadow-md
            ${
              isFinished
                ? 'bg-gold text-dark hover:bg-white'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
            }
          `}
        >
          {isFinished ? 'Classement final' : "Entrer dans l'arène"}
        </Link>
      </div>
    </div>
  );
};
