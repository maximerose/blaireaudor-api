import {
  type Competition,
  type Participation,
  type User,
} from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import {
  getDisplayDateText,
  canRevealScores,
  getCompetitionStatus,
  cn,
} from '@/utils';
import { StatusBadge } from '@/components/Competition';
import {
  RankedScore,
  RankBadge,
  Card,
  Button,
  Text,
  RoleBadge,
} from '@/components/UI';
import { useMemo } from 'react';

interface CompetitionCardProps {
  participation?: Participation;
  competition: Competition;
  user: User;
}

export const CompetitionCard = ({
  participation,
  competition,
  user,
}: CompetitionCardProps) => {
  const getEntityId = (entity: any) =>
    typeof entity === 'string' ? entity.split('/').pop() : entity?.id;
  const isCreator = user.id === getEntityId(competition.created_by);
  const isReferee = useMemo(() => {
    if (!competition.referees) return false;
    return competition.referees.some((ref: any) => {
      const refId = typeof ref === 'string' ? ref.split('/').pop() : ref.id;
      return refId === user.player?.id;
    });
  }, [competition, user]);
  const isParticipant = !!participation;
  const isManager = isCreator || isReferee;

  const score = participation?.score;
  const rank = participation?.rank;

  const dateText = getDisplayDateText(
    competition.start_date,
    competition.end_date,
  );
  const status = getCompetitionStatus(
    competition.start_date,
    competition.end_date,
  );

  const shouldReveal = canRevealScores(competition);
  const hasNoParticipants = competition.participants_count === 0;

  return (
    <Card
      variant="dark"
      isHoverable
      as="article"
      aria-labelledby={`title-${competition.join_code}`}
      className={cn(
        'relative p-4 sm:p-5 flex flex-col h-full group border-white/5 hover:border-gold/20 transition-all duration-500',
      )}
    >
      <div className="flex justify-between items-start gap-3 mb-4">
        <div className="flex gap-2">
          {isCreator && <RoleBadge role="creator" />}
          {isReferee && <RoleBadge role="referee" />}
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="flex justify-between items-start gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <Text
            id={`title-${competition.join_code}`}
            variant="h3"
            className="text-white group-hover:text-gold transition-colors truncate normal-case italic"
          >
            {competition.name}
          </Text>
          <Text variant="micro" className="text-gold/40 mt-0.5">
            <span className="sr-only">Dates : </span>
            {dateText}
          </Text>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex flex-col">
          <Text
            variant="micro"
            className="opacity-10 text-white uppercase font-black"
          >
            Accès
          </Text>
          <Text variant="mono" className="text-gold/60 uppercase">
            <span className="sr-only">Code d'accès : </span>
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
          aria-label={`${competition.participants_count} participants`}
        >
          <Text
            variant="micro"
            className="opacity-10 text-white uppercase font-black"
          >
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
              : `${competition.participants_count} ${
                  competition.participants_count > 1 ? 'Blaireaux' : 'Blaireau'
                }`}
          </Text>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-h-10 justify-center">
          {isParticipant ? (
            <>
              <Text
                variant="micro"
                className="opacity-20 text-white uppercase font-black"
              >
                {shouldReveal ? 'Résultats' : 'Brouillard de guerre'}
              </Text>
              <div className="flex items-center gap-4">
                {shouldReveal && score !== undefined && rank !== undefined ? (
                  <div
                    className="flex items-center gap-4"
                    aria-label={`Rang : ${rank}, Score : ${score}`}
                  >
                    <RankedScore score={score} rank={rank} />
                    <RankBadge rank={rank} />
                  </div>
                ) : (
                  <Text
                    variant="micro"
                    className="opacity-40 italic flex items-center gap-2 text-white"
                  >
                    Scores masqués{' '}
                    <span aria-hidden="true" className="text-xs">
                      🌫️
                    </span>
                  </Text>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col">
              <Text
                variant="micro"
                className="text-gold/40 uppercase font-black"
              >
                Rôle Officiel
              </Text>
              <Text variant="micro" className="text-white/30 italic">
                Mode spectateur / gestion
              </Text>
            </div>
          )}
        </div>

        <Button
          to={ROUTES.NAV_COMPETITION_DETAIL(competition.join_code)}
          variant={
            competition.is_finished || isManager ? 'primary' : 'secondary'
          }
          size="sm"
          fullWidth
          className="sm:w-auto"
          aria-label={`Entrer dans l'arène ${competition.name}`}
        >
          {competition.is_finished
            ? 'Voir le classement'
            : isManager
              ? 'Gérer le tournoi'
              : 'Entrer dans le tournoi'}
        </Button>
      </div>
    </Card>
  );
};
