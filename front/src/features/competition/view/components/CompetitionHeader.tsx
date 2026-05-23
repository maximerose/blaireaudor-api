// front/src/features/competition/view/components/CompetitionHeader.tsx

import { useMemo } from 'react';
import {
  Badge,
  BADGE_VARIANT,
  formatLongDate,
  ICONS,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Text,
  TEXT_VARIANT,
  TEXT_THEME, // 🟢 Import ajouté
  UI,
  Stack, // 🟢 Brique de Layout
  Row, // 🟢 Brique de Layout
} from '@/shared';
import { useAuthContext } from '@/features/account';
import type { RefereeListItem } from '@/features/player';
import { CompetitionCountdown } from './CompetitionCountdown';
import { COMPETITION_UI } from '@/features/competition/constants';
import { useCompetitionContext } from '@/features/competition/context';
import { usePermissions } from '@/features/competition/hooks';
import {
  getCompetitionReferees,
  getDisplayDateText,
  resolveCreatorName,
} from '@/features/competition/utils';
import type { BonusDay } from '@/features/competition/types';

export const CompetitionHeader = () => {
  const { user } = useAuthContext();
  const { competition, leaderboard, bonusDays } = useCompetitionContext();
  const { roles } = usePermissions();

  const referees = getCompetitionReferees(competition);

  const creatorName = useMemo(
    () => resolveCreatorName(competition, leaderboard, user),
    [competition, leaderboard, user],
  );

  return (
    <Stack as="header" gap="md" align="center" mb="md" className="text-center">
      <SectionHeader
        as="h1"
        variant={SECTION_HEADER_VARIANT.TITLE}
        title={competition.name}
        centered
        subtitle={
          <Text
            variant={TEXT_VARIANT.MONO}
            colorTheme={TEXT_THEME.GOLD}
            className="tracking-[0.4em] uppercase text-sm inline-block bg-gold-soft px-3 py-1 rounded border border-gold-border"
          >
            <span className="sr-only">
              {COMPETITION_UI.DETAIL.SECTIONS.HEADER.JOIN_CODE_ARIA}
            </span>
            {competition.join_code}
          </Text>
        }
      />

      <Stack gap="xs" align="center">
        <Text variant={TEXT_VARIANT.CAPTION} colorTheme={TEXT_THEME.MUTED}>
          <span className="sr-only">
            {COMPETITION_UI.DETAIL.SECTIONS.HEADER.DATES_ARIA}
          </span>
          {getDisplayDateText(competition.start_date, competition.end_date)}
        </Text>

        {competition.has_started &&
          !competition.is_finished &&
          competition.end_date && (
            <div
              className="bg-surface-base px-3 py-1 rounded-full border border-border-subtle"
              aria-live="polite"
            >
              <CompetitionCountdown
                prefix={COMPETITION_UI.DETAIL.SECTIONS.HEADER.COUNTDOWN_PREFIX}
                targetDate={competition.end_date}
              />
            </div>
          )}
      </Stack>

      {(creatorName || referees.length > 0) && (
        <Row
          wrap
          justify="center"
          align="center"
          gap="md"
          className="border-t pt-4 border-border-subtle max-w-xl mx-auto"
        >
          {creatorName && (
            <Row gap="xs" align="center" fullWidth={false}>
              <Text
                variant={TEXT_VARIANT.MICRO}
                colorTheme={TEXT_THEME.DIMMED}
                className="uppercase tracking-widest"
              >
                {COMPETITION_UI.DETAIL.SECTIONS.HEADER.CREATOR_LABEL}
              </Text>
              <Text
                variant={TEXT_VARIANT.CAPTION}
                className="font-medium text-success-bright"
              >
                {creatorName}
                {roles.isCreator && (
                  <span className="text-[9px] opacity-60 ml-1 uppercase">
                    ({UI.ME})
                  </span>
                )}
              </Text>
            </Row>
          )}

          {creatorName && referees.length > 0 && (
            <span
              className="hidden sm:inline-block w-1 h-1 rounded-full bg-text-dimmed"
              aria-hidden="true"
            />
          )}

          {referees.length > 0 && (
            <Row
              wrap
              justify="center"
              align="center"
              gap="xs"
              fullWidth={false}
            >
              <Text
                variant={TEXT_VARIANT.MICRO}
                colorTheme={TEXT_THEME.DIMMED}
                className="uppercase tracking-widest sm:mr-1"
              >
                {COMPETITION_UI.DETAIL.SECTIONS.HEADER.REFEREE_LABEL(
                  referees.length,
                )}
              </Text>
              {referees.map((ref: RefereeListItem) => {
                const isMe = user?.player?.id === ref.id;
                const isCreator = ref.userId === competition.created_by.id;

                return (
                  <Badge
                    key={ref.id}
                    variant={
                      isCreator
                        ? BADGE_VARIANT.CREATOR
                        : isMe
                          ? BADGE_VARIANT.ME
                          : BADGE_VARIANT.REFEREE
                    }
                    icon={isCreator ? ICONS.CREATOR : ICONS.REFEREE}
                  >
                    {ref.name}
                    {isMe && <span className="opacity-60">({UI.ME})</span>}
                  </Badge>
                );
              })}
            </Row>
          )}
        </Row>
      )}

      {bonusDays.length > 0 && (
        <Row
          wrap
          justify="center"
          align="center"
          gap="xs"
          className="pt-4 max-w-xl mx-auto"
        >
          <Text
            variant={TEXT_VARIANT.MICRO}
            colorTheme={TEXT_THEME.DIMMED}
            className="uppercase tracking-widest w-full mb-1 text-center"
          >
            {COMPETITION_UI.DETAIL.SECTIONS.HEADER.MULTIPLIERS_SECTION_TITLE}
          </Text>
          {bonusDays.map((bd: BonusDay) => (
            <Row
              key={bd.id}
              align="center"
              fullWidth={false}
              className="rounded-md overflow-hidden border border-bonus-border bg-bonus-soft"
            >
              <span className="px-2 py-1 text-[10px] font-mono text-silver bg-surface-base uppercase">
                {formatLongDate(bd.date)}
              </span>
              <span className="px-2 py-1 text-xs font-black text-game-bonus-bright">
                x{bd.multiplier}
              </span>
            </Row>
          ))}
        </Row>
      )}
    </Stack>
  );
};
