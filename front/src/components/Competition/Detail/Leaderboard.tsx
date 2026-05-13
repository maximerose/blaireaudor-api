import { Card, EmptyState, Text, TEXT_VARIANT } from '@/components/UI';
import { LeaderboardRow } from '@/components/Competition';
import { useLeaderboardUI } from '@/hooks';
import { COMPETITION_UI, ICONS } from '@/constants';

export const Leaderboard = () => {
  const {
    dislpayedParticipations,
    isFogActive,
    isAdmin,
    competition,
    handleDelete,
  } = useLeaderboardUI();

  return (
    <>
      <Card
        variant="dark"
        className="overflow-hidden shadow-2xl border-white/5"
        role="region"
        aria-label={COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.ARIA_TITLE(
          competition?.name,
        )}
      >
        {isFogActive && (
          <div className="bg-gold/5 px-4 py-2 border-b border-gold/10 flex items-center justify-center gap-2">
            <Text
              variant={TEXT_VARIANT.MICRO}
              className="text-gold uppercase font-black tracking-widest animate-pulse"
            >
              {COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.FOG_OF_WAR.ACTIVE}
            </Text>
          </div>
        )}
        <div className="divide-y divide-white/5" role="list">
          {dislpayedParticipations.map((item) => (
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
    </>
  );
};
