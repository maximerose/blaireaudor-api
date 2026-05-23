import {
  Card,
  ROUTES,
  Button,
  Text,
  BUTTON_SIZE,
  TEXT_VARIANT,
  TEXT_THEME,
  CARD_VARIANT,
  SectionHeader,
  ICONS,
  cn,
  SECTION_HEADER_VARIANT,
  Row,
  Stack,
} from '@/shared';
import { DASHBOARD_UI } from '@/features/dashboard';
import { RankBadge, RankedScore } from '@/features/competition/leaderboard';
import type { Competition, Participation } from '@/features/competition/types';
import { useCompetitionCard } from '@/features/competition/view/hooks';
import { RoleBadge } from './RoleBadge';
import { StatusBadge } from './StatusBadge';

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
    pendingCount,
  } = useCompetitionCard(competition, participation);

  return (
    <Card
      variant={CARD_VARIANT.DARK}
      isHoverable
      as="article"
      aria-labelledby={`title-${competition.join_code}`}
      className="h-full border-border-subtle hover:border-gold-border transition-slow"
    >
      <Card.Body p="lg">
        <Stack gap="md" className="h-full justify-between">
          <Stack gap="sm">
            <Row justify="between" align="start" gap="sm">
              <Row gap="xs" fullWidth={false}>
                {isCreator && <RoleBadge role="creator" />}
                {isReferee && <RoleBadge role="referee" />}
              </Row>
              <StatusBadge status={status} />
            </Row>

            <Row justify="center" className="text-center">
              <SectionHeader
                title={competition.name}
                subtitle={dateText}
                variant={SECTION_HEADER_VARIANT.SUB}
                centered
              />
            </Row>
          </Stack>

          <Row justify="between" align="start" gap="sm">
            <Stack gap="none" align="center" className="text-center w-fit">
              <Text
                variant={TEXT_VARIANT.MICRO}
                colorTheme={TEXT_THEME.DIMMED}
                className="uppercase font-black tracking-wider"
              >
                {DASHBOARD_UI.CARD.ACCESS_LABEL}
              </Text>
              <Text
                variant={TEXT_VARIANT.MONO}
                colorTheme={TEXT_THEME.GOLD}
                className="uppercase font-bold"
              >
                <span className="sr-only">
                  {DASHBOARD_UI.CARD.ARIA.JOIN_CODE}
                </span>
                {competition.join_code}
              </Text>
            </Stack>

            <Stack
              gap="none"
              align="end"
              p="xs"
              className={cn(
                'rounded-xl border transition-colors w-fit',
                hasNoParticipants
                  ? 'border-danger-border bg-danger-soft'
                  : 'border-border-subtle bg-surface-base',
              )}
              aria-label={DASHBOARD_UI.CARD.ARIA.PARTICIPANTS(
                competition.participants_count,
              )}
            >
              <Text
                variant={TEXT_VARIANT.MICRO}
                colorTheme={TEXT_THEME.DIMMED}
                className="uppercase font-black"
              >
                {DASHBOARD_UI.CARD.PARTICIPANTS_LABEL}
              </Text>
              <Text
                variant={TEXT_VARIANT.MICRO}
                className="font-bold"
                colorTheme={
                  hasNoParticipants ? TEXT_THEME.DANGER : TEXT_THEME.GOLD
                }
              >
                {hasNoParticipants
                  ? DASHBOARD_UI.CARD.EMPTY_COMPETITION
                  : DASHBOARD_UI.CARD.PARTICIPANT_COUNT(
                      competition.participants_count,
                    )}
              </Text>
            </Stack>
          </Row>

          {pendingCount > 0 && (
            <Row
              justify="center"
              align="center"
              gap="sm"
              className="bg-danger-soft border border-danger-border py-2 rounded-xl animate-pulse"
            >
              <span className="text-danger-bright text-xs" aria-hidden="true">
                {ICONS.REFEREE}
              </span>
              <Text
                variant={TEXT_VARIANT.MICRO}
                colorTheme={TEXT_THEME.DANGER}
                className="font-bold uppercase tracking-widest"
              >
                {DASHBOARD_UI.CARD.PENDING_ACTIONS_COUNT(pendingCount)}
              </Text>
            </Row>
          )}

          <Row
            justify="between"
            align="center"
            gap="md"
            className="pt-4 border-t border-border-subtle mt-auto flex-col sm:flex-row"
          >
            <Stack
              gap="none"
              className="items-center sm:items-start min-h-10 justify-center sm:w-auto"
            >
              <Text
                variant={TEXT_VARIANT.MICRO}
                colorTheme={TEXT_THEME.DIMMED}
                className="uppercase font-black text-center sm:text-left"
              >
                {isParticipant
                  ? shouldReveal
                    ? DASHBOARD_UI.CARD.RESULTS
                    : DASHBOARD_UI.CARD.FOG_OF_WAR
                  : DASHBOARD_UI.CARD.OFFICIAL_ROLE}
              </Text>

              {isParticipant ? (
                <div className="mt-1">
                  {(hasVisibleResults || isManager) &&
                  score !== undefined &&
                  rank !== undefined ? (
                    <Row
                      justify="center"
                      gap="md"
                      aria-label={DASHBOARD_UI.CARD.ARIA.RANK_SCORE(
                        rank,
                        score,
                      )}
                      className="sm:justify-start"
                    >
                      <RankedScore score={score} rank={rank} />
                      <RankBadge rank={rank} />
                    </Row>
                  ) : (
                    <Row
                      justify="center"
                      gap="xs"
                      className="mt-1 sm:justify-start"
                    >
                      <Text
                        variant={TEXT_VARIANT.MICRO}
                        colorTheme={TEXT_THEME.MUTED}
                        className="italic"
                      >
                        {DASHBOARD_UI.CARD.MASKED_SCORES}
                      </Text>
                      <span aria-hidden="true" className="text-xs opacity-40">
                        {ICONS.FOG_ACTIVE}
                      </span>
                    </Row>
                  )}
                </div>
              ) : (
                <Text
                  variant={TEXT_VARIANT.MICRO}
                  colorTheme={TEXT_THEME.DIMMED}
                  className="italic mt-1 text-center sm:text-left"
                >
                  {DASHBOARD_UI.CARD.SPECTATOR_MODE}
                </Text>
              )}
            </Stack>

            <Button
              to={ROUTES.NAV.COMPETITION_DETAIL(competition.join_code)}
              variant={
                competition.is_finished || isManager ? 'primary' : 'secondary'
              }
              size={BUTTON_SIZE.SMALL}
              className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0"
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
          </Row>
        </Stack>
      </Card.Body>
    </Card>
  );
};
