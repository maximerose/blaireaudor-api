import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils';
import { StatusBadge } from '@/components/Competition';
import {
  RankedScore,
  RankBadge,
  Card,
  Button,
  Text,
  RoleBadge,
  BUTTON_SIZE,
  TEXT_VARIANT,
  CARD_VARIANT,
  SectionHeader,
  SECTION_HEADER_VARIANT,
} from '@/components/UI';
import { useCompetitionCard } from '@/hooks';
import type { Competition, Participation } from '@/types';
import { DASHBOARD_UI, ICONS } from '@/constants';

interface CompetitionCardProps {
  competition: Competition;
  participation?: Participation;
}

export const CompetitionCard = ({
  participation,
  competition,
}: CompetitionCardProps) => {
  const {
    isCreator,
    isReferee,
    isManager,
    isParticipant,
    status,
    dateText,
    shouldReveal,
    score,
    rank,
    hasNoParticipants,
    hasVisibleResults,
  } = useCompetitionCard(competition, participation);

  return (
    <Card
      variant={CARD_VARIANT.DARK}
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
          <SectionHeader
            title={competition.name}
            subtitle={dateText}
            variant={SECTION_HEADER_VARIANT.SUB}
            centered
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex flex-col">
          <Text
            variant={TEXT_VARIANT.MICRO}
            className="opacity-10 text-white uppercase font-black"
          >
            {DASHBOARD_UI.CARD.ACCESS_LABEL}
          </Text>
          <Text variant={TEXT_VARIANT.MONO} className="text-gold/60 uppercase">
            <span className="sr-only">{DASHBOARD_UI.CARD.ARIA.JOIN_CODE}</span>
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
          aria-label={DASHBOARD_UI.CARD.ARIA.PARTICIPANTS(
            competition.participants_count,
          )}
        >
          <Text
            variant={TEXT_VARIANT.MICRO}
            className="opacity-10 text-white uppercase font-black"
          >
            {DASHBOARD_UI.CARD.PARTICIPANTS_LABEL}
          </Text>
          <Text
            variant={TEXT_VARIANT.MICRO}
            className={cn(
              'opacity-100 font-bold',
              hasNoParticipants ? 'text-danger-bright' : 'text-gold/80',
            )}
          >
            {hasNoParticipants
              ? DASHBOARD_UI.CARD.EMPTY_COMPETITION
              : DASHBOARD_UI.CARD.PARTICIPANT_COUNT(
                  competition.participants_count,
                )}
          </Text>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-h-10 justify-center">
          {isParticipant ? (
            <>
              <Text
                variant={TEXT_VARIANT.MICRO}
                className="opacity-20 text-white uppercase font-black"
              >
                {shouldReveal
                  ? DASHBOARD_UI.CARD.RESULTS
                  : DASHBOARD_UI.CARD.FOG_OF_WAR}
              </Text>
              <div className="flex items-center gap-4">
                {(hasVisibleResults || isManager) &&
                score !== undefined &&
                rank !== undefined ? (
                  <div
                    className="flex items-center gap-4"
                    aria-label={DASHBOARD_UI.CARD.ARIA.RANK_SCORE(rank, score)}
                  >
                    <RankedScore score={score} rank={rank} />
                    <RankBadge rank={rank} />
                  </div>
                ) : (
                  <Text
                    variant={TEXT_VARIANT.MICRO}
                    className="opacity-40 italic flex items-center gap-2 text-white"
                  >
                    {DASHBOARD_UI.CARD.MASKED_SCORES}
                    <span aria-hidden="true" className="text-xs">
                      {ICONS.FOG_ACTIVE}
                    </span>
                  </Text>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col">
              <Text
                variant={TEXT_VARIANT.MICRO}
                className="text-gold/40 uppercase font-black"
              >
                {DASHBOARD_UI.CARD.OFFICIAL_ROLE}
              </Text>
              <Text
                variant={TEXT_VARIANT.MICRO}
                className="text-white/30 italic"
              >
                {DASHBOARD_UI.CARD.SPECTATOR_MODE}
              </Text>
            </div>
          )}
        </div>

        <Button
          to={ROUTES.NAV.COMPETITION_DETAIL(competition.join_code)}
          variant={
            competition.is_finished || isManager ? 'primary' : 'secondary'
          }
          size={BUTTON_SIZE.SMALL}
          fullWidth
          className="sm:w-auto"
          aria-label={DASHBOARD_UI.CARD.ARIA.ENTER_COMPETITION(
            competition.name,
          )}
        >
          {competition.is_finished
            ? DASHBOARD_UI.BUTTONS.VIEW_COMPETITION
            : isManager
              ? DASHBOARD_UI.BUTTONS.MANAGE_COMPETITION
              : DASHBOARD_UI.BUTTONS.ENTER_COMPETITION}
        </Button>
      </div>
    </Card>
  );
};
