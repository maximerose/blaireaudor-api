import type React from 'react';
import {
  Badge,
  Text,
  Button,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  BADGE_VARIANT,
  TEXT_VARIANT,
  TEXT_THEME,
  cn,
  ICONS,
  Stack,
  Row,
} from '@/shared';
import { RoleBadge } from '@/features/competition/view';
import { useLeaderboardRow } from '@/features/competition/leaderboard/hooks';
import type {
  Competition,
  EnrichedLeaderboardItem,
} from '@/features/competition/types';
import { getMedalStyle } from '@/features/competition/utils';
import { COMPETITION_UI } from '@/features/competition/constants';
import { RankedScore } from './RankedScore';

interface LeaderboardRowProps extends React.HTMLAttributes<HTMLDivElement> {
  participation: EnrichedLeaderboardItem;
  onDelete: () => void;
  isAdmin: boolean;
  competition: Competition;
  isFogActive: boolean;
}

export const LeaderboardRow = ({
  participation,
  onDelete,
  isAdmin,
  isFogActive,
  className,
  competition,
  ...props
}: LeaderboardRowProps) => {
  const { canDelete, medal, playerName, hasAccount, isReferee, isCreator } =
    useLeaderboardRow(participation, isAdmin, competition);
  const showRealStats = !isFogActive || isAdmin;

  return (
    <div
      {...props}
      className={cn(
        'grid grid-cols-12 gap-2 p-4 items-center hover:bg-surface-base transition-default group',
        participation.isMe
          ? 'bg-player-me-bg'
          : participation.rank <= 3
            ? 'bg-surface-base'
            : 'bg-transparent',
        isFogActive && !participation.isMe && 'opacity-50',
        className,
      )}
    >
      <div className="col-span-2 flex justify-center">
        {showRealStats ? (
          medal ? (
            <span
              className={cn(
                getMedalStyle(participation.rank),
                'text-2xl animate-bounce-subtle',
              )}
              aria-hidden="true"
            >
              {medal}
            </span>
          ) : (
            <Badge variant={BADGE_VARIANT.GHOST}>
              <span className="sr-only">
                {COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.RANK}{' '}
              </span>
              {participation.rank}
            </Badge>
          )
        ) : (
          <Text colorTheme={TEXT_THEME.DIMMED}>
            {COMPETITION_UI.DETAIL.MASKED_POINTS}
          </Text>
        )}
      </div>

      <Row
        justify="between"
        align="center"
        className="col-span-7 pr-1 overflow-hidden"
      >
        <Stack gap="none" className="overflow-hidden text-left min-w-0">
          <Row wrap align="center" gap="sm">
            <Text
              variant={TEXT_VARIANT.H3}
              as="span"
              colorTheme={
                participation.isMe ? TEXT_THEME.GOLD : TEXT_THEME.DEFAULT
              }
              className="truncate normal-case italic max-w-30 sm:max-w-none"
            >
              {playerName}
            </Text>

            <Row wrap align="center" gap="xs">
              {!hasAccount && <RoleBadge role="guest" />}
              {isCreator && <RoleBadge role="creator" />}
              {isReferee && <RoleBadge role="referee" />}
            </Row>
          </Row>

          {showRealStats && participation.isExAequo && (
            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={TEXT_THEME.DIMMED}
              className="italic"
            >
              {COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.EXAEQUO}
            </Text>
          )}
        </Stack>

        {canDelete && (
          <Button
            variant={BUTTON_VARIANT.GHOST}
            size={BUTTON_SIZE.SMALL}
            onClick={onDelete}
            className="text-danger hover:text-danger-bright hover:bg-danger-soft"
            aria-label={COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.ARIA_DELETE_PARTICIPATION(
              playerName,
            )}
            title={
              COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.DELETE_PARTICIPATION
            }
          >
            <span aria-hidden="true">{ICONS.CANCEL}</span>
          </Button>
        )}
      </Row>

      <div
        className="col-span-3 flex items-center justify-end"
        aria-label={COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.ARIA_SCORE(
          participation.score,
        )}
      >
        <RankedScore
          score={participation.score}
          rank={participation.rank}
          isFogActive={isFogActive}
          shouldHidePoints={!showRealStats && !participation.isMe}
        />
      </div>
    </div>
  );
};
