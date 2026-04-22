import { Badge } from '../UI/Badge';
import { RankedScore } from '../UI/RankedScore';
import { getMedalStyle, getRankMedal } from '../../utils/rankStyles';
import { Text } from '../UI/Typography';
import { Button } from '../UI/Button';
import { cn } from '../../utils/cn';

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
      className={cn(
        'grid grid-cols-12 gap-2 p-4 items-center hover:bg-white/5 transition-all duration-300 group',
        item.rank <= 3 ? 'bg-white/2' : 'bg-transparent',
      )}
    >
      <div className="col-span-2 flex justify-center">
        {medal ? (
          <span
            className={cn(getMedalStyle(item.rank), 'text-2xl animate-fade-in')}
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
            <Text
              variant="h3"
              as="span"
              className={cn(
                'truncate normal-case italic',
                item.isMe ? 'text-gold' : 'text-white/90',
              )}
            >
              {item.player.display_name || item.player.displayName}
            </Text>
            {item.isMe && (
              <Badge variant="gold" isPulse>
                Moi
              </Badge>
            )}
          </div>

          {item.isExAequo && (
            <Text variant="micro" className="text-white/20 italic">
              Ex-æquo
            </Text>
          )}
        </div>

        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-danger-bright/20 hover:text-danger-bright hover:bg-danger/10 px-2"
            title="Supprimer la participation"
          >
            ✕
          </Button>
        )}
      </div>

      <div className="col-span-3 flex items-center justify-end">
        <RankedScore score={item.score} rank={item.rank} />
      </div>
    </div>
  );
};
