import { Badge } from './Badge';

interface Player {
  id: string;
  displayName?: string;
  display_name?: string;
  username: string;
  lastCompetitionName?: string;
  last_competition_name?: string;
}

interface Props {
  player: Player;
  onClick: (player: Player) => void;
  actionIcon?: string;
}

export const PlayerSearchResultItem = ({
  player,
  onClick,
  actionIcon = '+',
}: Props) => {
  const name = player.display_name || player.displayName;
  const lastComp = player.last_competition_name || player.lastCompetitionName;

  return (
    <button
      type="button"
      onClick={() => onClick(player)}
      className="w-full text-left p-3 hover:bg-gold/10 rounded-xl transition-colors flex justify-between items-center group border border-transparent hover:border-gold/10"
    >
      <div className="flex flex-col gap-0.5 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white font-bold truncate">{name}</span>
          <span className="text-[10px] text-gold/40 font-mono italic truncate">
            @{player.username}
          </span>
        </div>

        {lastComp ? (
          <span className="text-[9px] text-white/30 uppercase tracking-tighter truncate">
            Dernièrement vu : {lastComp}
          </span>
        ) : (
          <Badge variant="info" className="text-[7px] py-0.5 px-1.5">
            Nouveau joueur 🐣
          </Badge>
        )}
      </div>

      <div className="ml-4 shrink-0">
        <span className="text-[8px] text-gold px-2 py-1 rounded-lg font-black shadow-lg">
          {actionIcon}
        </span>
      </div>
    </button>
  );
};
