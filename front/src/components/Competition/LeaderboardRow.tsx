import type { EnrichedLeaderboardItem } from '../../hooks/useLeaderboardLogic';
import { Badge } from '../UI/Badge';
import { RankedScore } from '../UI/RankedScore';
import { getMedalStyle, getRankMedal } from '../../utils/rankStyles';

interface LeaderboardRowProps {
  item: EnrichedLeaderboardItem;
  onDelete: () => void;
}

// front/src/components/Competition/LeaderboardRow.tsx

export const LeaderboardRow = ({ item, onDelete }: LeaderboardRowProps) => {
  const canDelete = item.actions.length === 0;
  const medal = getRankMedal(item.rank);

  return (
    <div
      className={`grid grid-cols-12 gap-2 p-4 items-center hover:bg-white/5 transition-colors group ${
        item.rank <= 3 ? 'bg-white/2' : ''
      }`}
    >
      <div className="col-span-2 flex justify-center">
        {medal ? (
          <span
            className={getMedalStyle(item.rank)}
            title={`Rang ${item.rank}`}
          >
            {medal}
          </span>
        ) : (
          <Badge variant="ghost" className="opacity-40">
            {item.rank}
          </Badge>
        )}
      </div>

      <div className="col-span-7 flex items-center justify-between pr-1 overflow-hidden">
        <div className="flex flex-col gap-0.5 overflow-hidden text-left min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`font-bold text-sm truncate ${
                item.isMe ? 'text-gold' : 'text-white'
              }`}
            >
              {item.player.display_name || item.player.displayName}
            </span>
            {item.isMe && (
              <Badge variant="gold" className="shrink-0">
                Moi
              </Badge>
            )}
          </div>
          {item.isExAequo && (
            <span className="text-[8px] text-white/20 uppercase font-bold">
              Ex-æquo
            </span>
          )}
        </div>

        {canDelete && (
          <button
            onClick={onDelete}
            className="ml-2 p-3 -mr-2 text-red-500/40 active:text-red-500 active:scale-95 transition-all lg:opacity-0 lg:group-hover:opacity-100 touch-manipulation"
            title="Supprimer la participation"
          >
            <span className="text-xl">✕</span>
          </button>
        )}
      </div>

      <div className="col-span-3 flex items-baseline justify-end gap-1 font-mono font-bold">
        <RankedScore score={item.score} rank={item.rank} />
      </div>
    </div>
  );
};
