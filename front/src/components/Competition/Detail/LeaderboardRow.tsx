import type React from 'react';
import { Badge, RankedScore, Text, Button } from '@/components/UI';
import { getMedalStyle, cn } from '@/utils';
import { useLeaderboardRow } from '@/hooks';

interface LeaderboardRowProps extends React.HTMLAttributes<HTMLDivElement> {
  item: any;
  onDelete: () => void;
  isAdmin: boolean;
}

export const LeaderboardRow = ({
  item,
  onDelete,
  isAdmin,
  className,
  ...props
}: LeaderboardRowProps) => {
  const { canDelete, medal, playerName } = useLeaderboardRow(item, isAdmin);

  return (
    <div
      {...props}
      className={cn(
        'grid grid-cols-12 gap-2 p-4 items-center hover:bg-white/5 transition-default group',
        item.rank <= 3 ? 'bg-white/2' : 'bg-transparent',
        className,
      )}
    >
      <div className="col-span-2 flex justify-center">
        {medal ? (
          <span
            className={cn(getMedalStyle(item.rank), 'text-2xl animate-fade-in')}
            aria-hidden="true"
          >
            {medal}
          </span>
        ) : (
          <Badge variant="ghost">
            <span className="sr-only">Rang </span>
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
              {playerName}
            </Text>
            {item.isMe && (
              <Badge variant="gold" isPulse aria-label="C'est vous">
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
            className="text-danger-bright/20 hover:text-danger-bright hover:bg-danger/10 px-2 transition-default"
            aria-label={`Supprimer la participation de ${playerName}`}
            title="Supprimer la participation"
          >
            <span aria-hidden="true">✕</span>
          </Button>
        )}
      </div>

      <div
        className="col-span-3 flex items-center justify-end"
        aria-label={`Score : ${item.score} points`}
      >
        <RankedScore score={item.score} rank={item.rank} />
      </div>
    </div>
  );
};
