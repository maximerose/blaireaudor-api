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
      className="w-full text-left p-3 hover:bg-gold/5 rounded-xl transition-all flex justify-between items-center group border border-transparent hover:border-gold/10"
    >
      <div className="flex flex-col min-w-0">
        <span className="text-sm text-white font-bold truncate group-hover:text-gold transition-colors">
          {name}
        </span>

        <span className="text-[10px] text-gold/30 font-mono italic leading-none mt-0.5">
          @{player.username}
        </span>

        {lastComp ? (
          <div className="flex items-center gap-1 mt-1 overflow-hidden">
            <span className="text-[9px] text-white/20 italic font-light shrink-0">
              Dernier tournoi :
            </span>
            <span className="text-[9px] text-info-bright/60 italic font-medium truncate">
              {lastComp}
            </span>
          </div>
        ) : (
          <Badge
            variant="info"
            className="text-[7px] py-0 px-1.5 mt-1 w-fit opacity-60"
          >
            Nouveau joueur 🐣
          </Badge>
        )}
      </div>

      <div className="ml-4 shrink-0">
        <span className="text-[10px] font-black text-gold/20 group-hover:text-gold transition-colors">
          {actionIcon}
        </span>
      </div>
    </button>
  );
};
