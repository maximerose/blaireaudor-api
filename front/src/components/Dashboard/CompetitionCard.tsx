import { type Participation } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
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
import { cn } from '../../utils/cn';

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

  const hasNoParticipants = competition.participants_count === 0;

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
            className="text-white group-hover:text-gold transition-colors truncate normal-case italic"
          >
            {competition.name}
          </Text>
          <Text variant="micro" className="text-gold/40 mt-0.5">
            {dateText}
          </Text>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex flex-col">
          <Text variant="micro" className="opacity-10 text-white">
            Accès
          </Text>
          <Text variant="mono" className="text-gold/60">
            {competition.join_code}
          </Text>
        </div>

        <div
          className={cn(
            'flex flex-col items-end px-3 py-1 rounded-xl border transition-colors',
            hasNoParticipants
              ? 'border-danger-bright/20 bg-danger/5'
              : 'border-white/5 bg-white/2',
          )}
        >
          <Text variant="micro" className="opacity-10 text-white">
            Participants
          </Text>
          <Text
            variant="micro"
            className={cn(
              'opacity-100 font-bold',
              hasNoParticipants ? 'text-danger-bright' : 'text-gold/80',
            )}
          >
            {hasNoParticipants
              ? 'Arène vide'
              : `${competition.participants_count} ${competition.participants_count > 1 ? 'Blaireaux' : 'Blaireau'}`}
          </Text>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-h-10 justify-center">
          <Text variant="micro" className="opacity-20 text-white">
            {shouldReveal ? 'Résultats' : 'Brouillard de guerre'}
          </Text>

          <div className="flex items-center gap-4">
            {shouldReveal ? (
              <>
                <RankedScore score={score} rank={rank} />
                <RankBadge rank={rank} />
              </>
            ) : (
              <Text
                variant="micro"
                className="opacity-40 italic flex items-center gap-2 text-white"
              >
                Scores masqués <span className="text-xs">🌫️</span>
              </Text>
            )}
          </div>
        </div>

        <Button
          to={ROUTES.NAV_COMPETITION_DETAIL(competition.join_code)}
          variant={isFinished ? 'primary' : 'secondary'}
          size="sm"
          fullWidth
          className="sm:w-auto"
        >
          {isFinished ? 'Voir le classement' : "Entrer dans l'arène"}
        </Button>
      </div>
    </Card>
  );
};
