import type React from 'react';
import { Badge, Text } from '@/components/UI';
import { usePlayerSearchResultUI } from '@/hooks';

interface Player {
  id: string;
  displayName?: string;
  display_name?: string;
  username: string;
  lastCompetitionName?: string;
  last_competition_name?: string;
}

interface Props extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick'
> {
  player: Player;
  onClick: (player: Player) => void;
  actionIcon?: string | React.ReactNode;
}

export const PlayerSearchResultItem = ({
  player,
  onClick,
  actionIcon = '+',
  className = '',
  ...props
}: Props) => {
  const { name, lastComp, itemClasses, actionIconClasses } =
    usePlayerSearchResultUI(player, className);

  return (
    <button
      type="button"
      onClick={() => onClick(player)}
      role="option"
      aria-label={`Sélectionner ${name}`}
      className={itemClasses}
      {...props}
    >
      <div className="flex flex-col min-w-0 pointer-events-none">
        <Text
          as="span"
          className="text-sm text-gold font-bold truncate group-hover:text-gold transition-default"
        >
          {name}
        </Text>

        <Text
          as="span"
          className="text-[10px] text-gold/30 font-mono italic leading-none mt-0.5 truncate"
        >
          @{player.username}
        </Text>

        {lastComp ? (
          <div className="flex items-center gap-1 mt-1 overflow-hidden">
            <Text
              as="span"
              className="text-[9px] text-white/20 italic font-light shrink-0"
            >
              Dernier tournoi :
            </Text>
            <Text
              as="span"
              className="text-[9px] text-info-bright/60 italic font-medium truncate"
            >
              {lastComp}
            </Text>
          </div>
        ) : (
          <Badge variant="info" className="py-0 px-1.5 mt-1 w-fit opacity-60">
            Nouveau joueur <span aria-hidden="true">🐣</span>
          </Badge>
        )}
      </div>

      <div className="ml-4 shrink-0" aria-hidden="true">
        <span className={actionIconClasses}>{actionIcon}</span>
      </div>
    </button>
  );
};
