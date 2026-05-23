import {
  Card,
  CARD_VARIANT,
  EmptyState,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  ICONS,
  Row,
  Stack,
} from '@/shared';
import { useLeaderboardUI } from '@/features/competition/leaderboard/hooks';
import { COMPETITION_UI } from '@/features/competition/constants';
import type { EnrichedLeaderboardItem } from '@/features/competition/types';
import { LeaderboardRow } from './LeaderboardRow';
import { InlineEnrollment } from '../../enrollment';

export const Leaderboard = () => {
  const {
    dislpayedParticipations,
    isFogActive,
    isAdmin,
    competition,
    handleDelete,
  } = useLeaderboardUI();

  return (
    <Stack gap="sm">
      <Card
        variant={CARD_VARIANT.DARK}
        className="overflow-hidden shadow-2xl border-border-subtle"
        role="region"
        padding="none"
        aria-label={COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.ARIA_TITLE(
          competition?.name,
        )}
      >
        {isFogActive && (
          <Row
            justify="center"
            align="center"
            gap="sm"
            className="bg-gold-soft border-b border-gold-border py-2 px-4"
          >
            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={TEXT_THEME.GOLD}
              className="uppercase font-black tracking-widest animate-pulse"
            >
              {COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.FOG_OF_WAR.ACTIVE}
            </Text>
          </Row>
        )}

        <div className="divide-y divide-border-subtle" role="list">
          {dislpayedParticipations.map((item: EnrichedLeaderboardItem) => (
            <LeaderboardRow
              key={item.id}
              participation={item}
              isAdmin={isAdmin}
              isFogActive={isFogActive}
              role="listitem"
              competition={competition}
              onDelete={() => handleDelete(item)}
            />
          ))}
        </div>

        {dislpayedParticipations.length === 0 && (
          <EmptyState
            layout="card"
            icon={ICONS.EMPTY}
            title={COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.EMPTY.TITLE}
            message={COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.EMPTY.MESSAGE}
            role="status"
          />
        )}
      </Card>

      {!competition.is_finished && <InlineEnrollment />}
    </Stack>
  );
};
