import { Badge } from '../UI/Badge';
import { RankedScore } from '../UI/RankedScore';
import { getMedalStyle, getRankMedal } from '../../utils/rankStyles';
import { Text } from '../UI/Typography';

interface LeaderboardRowProps {
  item: any;
  onDelete: () => void;
  isAdmin: boolean;
}

export const LeaderboardRow = ({
  item,
  onDelete,
  isAdmin,
}: LeaderboardRowProps) => {
  const canDelete = isAdmin && item.actions.length === 0;
  const medal = getRankMedal(item.rank);

  return (
    <div
      className={`grid grid-cols-12 gap-2 p-4 items-center hover:bg-white/2 transition-colors group ${
        item.rank <= 3 ? 'bg-white/1' : ''
      }`}
    >
      <div className="col-span-2 flex justify-center">
        {medal ? (
          <span
            className={`${getMedalStyle(item.rank)} text-2xl`}
            title={`Rang ${item.rank}`}
          >
            {medal}
          </span>
        ) : (
          <Badge variant="ghost" className="opacity-60">
            {item.rank}
          </Badge>
        )}
      </div>

      <div className="col-span-7 flex items-center justify-between pr-1 overflow-hidden">
        <div className="flex flex-col gap-0.5 overflow-hidden text-left min-w-0">
          <div className="flex items-center gap-2">
            <Text
              variant="h3"
              as="span"
              className={`truncate ${item.isMe ? 'text-gold' : 'text-white'}`}
            >
              {item.player.display_name || item.player.displayName}
            </Text>
            {item.isMe && <Badge variant="gold">Moi</Badge>}
          </div>

          {item.isExAequo && (
            <Text variant="caption" className="text-[8px] text-white/20">
              Ex-æquo
            </Text>
          )}
        </div>

        {canDelete && (
          <button
            onClick={onDelete}
            className="ml-2 p-3 -mr-2 text-danger-bright/20 hover:text-danger-bright  rounded-full transition-all active:scale-90"
            title="Supprimer la participation"
          >
            <span className="text-lg leading-none">✕</span>
          </button>
        )}
      </div>

      <div className="col-span-3 flex items-baseline justify-end gap-1">
        <RankedScore score={item.score} rank={item.rank} />
      </div>
    </div>
  );
};
