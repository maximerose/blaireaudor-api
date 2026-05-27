import { useMemo } from 'react';
import {
  Card,
  CARD_VARIANT,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  Stack,
  ICONS,
  cn,
  SectionHeader,
  SECTION_HEADER_THEME,
  SECTION_HEADER_VARIANT,
} from '@/shared';
import { RankBadge } from '@/features/competition/leaderboard';
import { COMPETITION_STATS_GENERAL } from '@/features/stats/constants';
import type { ProgressBannerProps } from '@/features/stats/types';

export const CompetitionProgressBanner = ({
  myParticipation,
  leaderboard,
  myPlayerId,
}: ProgressBannerProps) => {
  const leader = leaderboard[0];
  const pointsBehind = useMemo(() => {
    return leader && leader.player.id !== myPlayerId
      ? leader.score - myParticipation.score
      : 0;
  }, [leader, myParticipation, myPlayerId]);

  const actionsCount = myParticipation.validated_actions_count ?? 0;

  return (
    <Stack gap="sm" className="w-full animate-fade-in">
      <SectionHeader
        variant={SECTION_HEADER_VARIANT.DIVIDER}
        colorTheme={SECTION_HEADER_THEME.DEFAULT}
        title={COMPETITION_STATS_GENERAL.PROGRESS_BANNER.TITLE}
      />

      <div className="grid gap-2 w-full grid-cols-2 sm:grid-cols-4">
        {/* Score */}
        <Card
          variant={CARD_VARIANT.DARK}
          className="bg-surface-base border-border-subtle"
        >
          <Card.Body
            p="sm"
            align="center"
            justify="center"
            className="text-center h-full flex flex-col justify-between"
          >
            <span className="text-lg mb-2 opacity-30" aria-hidden="true">
              {ICONS.POINTS}
            </span>
            <Text
              variant={TEXT_VARIANT.H3}
              className="font-black leading-none text-gold flex items-baseline justify-center gap-1"
            >
              {myParticipation.score}{' '}
              <span className="text-xs font-normal opacity-50 lowercase">
                pts
              </span>
            </Text>
            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={TEXT_THEME.DIMMED}
              className="mt-3 block w-full"
            >
              {COMPETITION_STATS_GENERAL.PROGRESS_BANNER.SCORE}
            </Text>
          </Card.Body>
        </Card>

        {/* Écart */}
        <Card
          variant={CARD_VARIANT.DARK}
          className="bg-surface-base border-border-subtle"
        >
          <Card.Body
            p="sm"
            align="center"
            justify="center"
            className="text-center h-full flex flex-col justify-between"
          >
            <span className="text-lg mb-2 opacity-30" aria-hidden="true">
              {ICONS.GAP}
            </span>
            <Text
              variant={TEXT_VARIANT.H3}
              className={cn(
                'font-black leading-none flex items-baseline justify-center gap-1',
                pointsBehind > 0 ? 'text-danger-bright' : 'text-success-bright',
              )}
            >
              {pointsBehind > 0
                ? `-${pointsBehind}`
                : COMPETITION_STATS_GENERAL.PROGRESS_BANNER.BOSS_LABEL}
              {pointsBehind > 0 && (
                <span className="text-xs font-normal opacity-50 lowercase">
                  pts
                </span>
              )}
            </Text>
            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={TEXT_THEME.DIMMED}
              className="mt-3 block w-full"
            >
              {COMPETITION_STATS_GENERAL.PROGRESS_BANNER.GAP}
            </Text>
          </Card.Body>
        </Card>

        {/* Classement */}
        <Card
          variant={CARD_VARIANT.DARK}
          className="bg-surface-base border-border-subtle"
        >
          <Card.Body
            p="sm"
            align="center"
            justify="center"
            className="text-center h-full flex flex-col justify-between"
          >
            <span className="text-lg mb-2 opacity-30" aria-hidden="true">
              {ICONS.RANKING}
            </span>
            <div className="flex-1 flex items-center justify-center w-full">
              <RankBadge
                rank={myParticipation.rank}
                className="scale-110 m-auto"
              />
            </div>
            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={TEXT_THEME.DIMMED}
              className="mt-3 block w-full"
            >
              {COMPETITION_STATS_GENERAL.PROGRESS_BANNER.RANK}
            </Text>
          </Card.Body>
        </Card>

        {/* Actions subies */}
        <Card
          variant={CARD_VARIANT.DARK}
          className="bg-surface-base border-border-subtle"
        >
          <Card.Body
            p="sm"
            align="center"
            justify="center"
            className="text-center h-full flex flex-col justify-between"
          >
            <span className="text-lg mb-2 opacity-30" aria-hidden="true">
              {ICONS.ACTION}
            </span>
            <Text
              variant={TEXT_VARIANT.H3}
              className="font-black leading-none text-info-bright"
            >
              {actionsCount}
            </Text>
            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={TEXT_THEME.DIMMED}
              className="mt-3 block w-full"
            >
              {COMPETITION_STATS_GENERAL.PROGRESS_BANNER.ACTIONS(actionsCount)}
            </Text>
          </Card.Body>
        </Card>
      </div>
    </Stack>
  );
};
