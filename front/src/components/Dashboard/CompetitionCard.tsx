import { type Participation } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { Link } from 'react-router-dom';
import {
  getIsFinished,
  getDisplayDateText,
  canRevealScores,
  getCompetitionStatus,
} from '../../utils/competitionHelper';
import { StatusBadge } from '../Competition/StatusBadge';
import { RankedScore } from '../UI/RankedScore';
import { RankBadge } from '../UI/RankBadge';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Text } from '../UI/Typography';

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

  return (
    <Card
      variant="dark"
      isHoverable
      className="p-4 sm:p-5 flex flex-col h-full group border-white/5 hover:border-gold/20 transition-all duration-500"
    >
      <div className="flex justify-between items-start gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <Text
            variant="h3"
            className="text-white group-hover:text-gold transition-colors truncate text-base sm:text-lg leading-tight uppercase italic"
          >
            {competition.name}
          </Text>
          <Text
            variant="caption"
            className="text-gold/40 text-[8px] sm:text-[9px] tracking-widest block mt-0.5"
          >
            {dateText}
          </Text>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex flex-col">
          <span className="text-[7px] uppercase font-black text-white/10 tracking-[0.2em]">
            Accès
          </span>
          <span className="text-[10px] sm:text-xs font-mono text-gold/60 tracking-wider">
            {competition.join_code}
          </span>
        </div>

        <div
          className={`flex flex-col items-end px-3 py-1 rounded-xl border ${
            competition.participants_count === 0
              ? 'border-danger-bright/20 bg-danger/5'
              : 'border-white/5 bg-white/2'
          }`}
        >
          <span className="text-[7px] uppercase font-black text-white/10 tracking-[0.2em]">
            Participants
          </span>
          <span
            className={`text-[9px] font-bold uppercase tracking-tighter ${
              competition.participants_count === 0
                ? 'text-danger-bright'
                : 'text-gold/80'
            }`}
          >
            {competition.participants_count === 0
              ? 'Arène vide'
              : `${competition.participants_count} ${competition.participants_count > 1 ? 'Blaireaux' : 'Blaireau'}`}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-h-10 justify-center">
          <Text
            variant="caption"
            className="text-white/20 text-[7px] sm:text-[8px] uppercase font-black tracking-[0.2em]"
          >
            {shouldReveal ? 'Résultats' : 'Brouillard de guerre'}
          </Text>

          <div className="flex items-center gap-4">
            {shouldReveal ? (
              <>
                <RankedScore score={score} rank={rank} />
                <RankBadge rank={rank} />
              </>
            ) : (
              <span className="text-[10px] sm:text-xs opacity-40 italic font-bold text-white uppercase tracking-widest flex items-center gap-2">
                Scores masqués <span className="text-xs">🌫️</span>
              </span>
            )}
          </div>
        </div>

        <Button
          as={Link}
          to={ROUTES.NAV_COMPETITION_DETAIL(competition.join_code)}
          variant={isFinished ? 'primary' : 'secondary'}
          size="sm"
          fullWidth
          className="sm:w-auto text-[10px]"
        >
          {isFinished ? 'Voir le classement' : "Entrer dans l'arène"}
        </Button>
      </div>
    </Card>
  );
};
