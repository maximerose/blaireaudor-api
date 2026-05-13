import type React from 'react';
import { Badge, RankedScore, Text, Button, RoleBadge } from '@/components/UI';
import { getMedalStyle, cn } from '@/utils';
import { useLeaderboardRow } from '@/hooks';
import type { Competition, EnrichedLeaderboardItem } from '@/types';
import { COMPETITION_UI, ICONS } from '@/constants';

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
        'grid grid-cols-12 gap-2 p-4 items-center hover:bg-white/5 transition-default group',
        participation.isMe
          ? 'bg-player-me-bg hover:bg-player-me/7'
          : participation.rank <= 3
            ? 'bg-white/3'
            : 'bg-transparent',
        isFogActive && !participation.isMe && 'opacity-60',
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
            <Badge variant="ghost">
              <span className="sr-only">
                {COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.RANK}{' '}
              </span>
              {participation.rank}
            </Badge>
          )
        ) : (
          <Text className="opacity-20">
            {COMPETITION_UI.DETAIL.MASKED_POINTS}
          </Text>
        )}
      </div>

      <div className="col-span-7 flex items-center justify-between pr-1 overflow-hidden">
        <div className="flex flex-col gap-0.5 overflow-hidden text-left min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Text
              variant="h3"
              as="span"
              className={cn(
                'truncate normal-case italic max-w-30 sm:max-w-none',
                participation.isMe ? 'text-player-me' : 'text-player-other',
              )}
            >
              {playerName}
            </Text>

            <div className="flex items-center gap-1.5 flex-wrap">
              {!hasAccount && <RoleBadge role="guest" />}
              {isCreator && <RoleBadge role="creator" />}
              {isReferee && <RoleBadge role="referee" />}
            </div>
          </div>

          {showRealStats && participation.isExAequo && (
            <Text variant="micro" className="text-white/20 italic">
              {COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.EXAEQUO}
            </Text>
          )}
        </div>

        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-danger-bright/20 hover:text-danger-bright hover:bg-danger/10 px-2 transition-default"
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
      </div>

      <div
        className="col-span-3 flex items-center justify-end"
        aria-label={`Score : ${participation.score} points`}
      >
        {showRealStats || participation.isMe ? (
          <RankedScore
            score={participation.score}
            rank={participation.rank}
            isFogActive={isFogActive}
          />
        ) : (
          <div className="flex items-center gap-1 opacity-20">
            <Text variant="mono" className="text-xs">
              {COMPETITION_UI.DETAIL.MASKED_POINTS}
            </Text>
            <Text className="text-[8px] uppercase">
              {COMPETITION_UI.DETAIL.POINTS_SHORT}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};
