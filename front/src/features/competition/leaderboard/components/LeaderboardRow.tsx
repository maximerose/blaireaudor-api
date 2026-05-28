import { MergePlayersModal } from '@/features/competition/admin/components';
import { COMPETITION_UI } from '@/features/competition/constants';
import { useLeaderboardRow } from '@/features/competition/leaderboard/hooks';
import type {
  Competition,
  EnrichedLeaderboardItem,
} from '@/features/competition/types';
import { getMedalStyle } from '@/features/competition/utils';
import { RoleBadge } from '@/features/competition/view';
import {
  Badge,
  BADGE_VARIANT,
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  cn,
  ICONS,
  Row,
  Stack,
  Text,
  TEXT_THEME,
  TEXT_VARIANT,
} from '@/shared';
import type React from 'react';
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
  const {
    canDelete,
    isMe,
    medal,
    playerName,
    hasAccount,
    isReferee,
    isCreator,
    isMergeModalOpen,
    setIsMergeModalOpen,
  } = useLeaderboardRow(participation, isAdmin, competition);
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
              colorTheme={isMe ? TEXT_THEME.GOLD : TEXT_THEME.DEFAULT}
              className="truncate normal-case italic max-w-none"
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

        <Row
          gap="xs"
          align="center"
          justify="end"
          className="shrink-0"
          fullWidth={false}
        >
          {isAdmin && !hasAccount && !competition.is_finished && (
            <Button
              variant={BUTTON_VARIANT.GHOST}
              size={BUTTON_SIZE.SMALL}
              onClick={(e) => {
                e.stopPropagation();
                setIsMergeModalOpen(true);
              }}
              className="min-h-10 min-w-10 flex items-center justify-center p-0 text-info hover:text-info-bright hover:bg-info-soft"
              title={COMPETITION_UI.ADMIN.MERGE.ROW_TOOLTIP}
              aria-label={COMPETITION_UI.ADMIN.MERGE.ROW_TOOLTIP}
            >
              <span aria-hidden="true" className="text-xl">
                {ICONS.LINK_PROFILE}
              </span>
            </Button>
          )}

          {canDelete && (
            <Button
              variant={BUTTON_VARIANT.GHOST}
              size={BUTTON_SIZE.SMALL}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className={cn(
                'min-h-10 min-w-10 flex items-center justify-center p-0',
                isMe
                  ? 'text-warning hover:text-warning-bright hover:bg-warning-soft'
                  : 'text-danger hover:text-danger-bright hover:bg-danger-soft',
              )}
              aria-label={
                isMe
                  ? COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD
                      .ARIA_LEAVE_COMPETITION
                  : COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.ARIA_DELETE_PARTICIPATION(
                      playerName,
                    )
              }
              title={
                isMe
                  ? COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD
                      .ARIA_LEAVE_COMPETITION
                  : COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD
                      .DELETE_PARTICIPATION
              }
            >
              <span aria-hidden="true" className="text-xl">
                {ICONS.REMOVE_PLAYER}
              </span>
            </Button>
          )}
        </Row>
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

      {isMergeModalOpen && (
        <MergePlayersModal
          competitionId={competition.id}
          competitionCode={competition.join_code}
          guestPlayer={{
            id: participation.player.id,
            display_name: playerName,
            actions_count: participation.has_actions ? 1 : 0,
          }}
          onClose={() => setIsMergeModalOpen(false)}
        />
      )}
    </div>
  );
};
