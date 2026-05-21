import type { PlayerCompact } from '@/features/player/types';
import { cn } from '@/shared';

export const usePlayerSearchResultUI = (
  player: PlayerCompact,
  className: string,
) => {
  const name = player.display_name;
  const lastComp = player.last_competition_name;

  const classes = {
    container: cn(
      'w-full text-left p-3 hover:bg-gold/5 rounded-xl transition-default flex justify-between items-center group border border-transparent hover:border-gold/10',
      'focus:outline-none focus:bg-gold/10 focus:border-gold/20',
      className,
    ),
    infoWrapper: 'flex flex-col min-w-0 pointer-events-none',
    name: 'text-sm text-gold font-bold truncate group-hover:text-gold transition-default',
    username:
      'text-[10px] text-gold/30 font-mono italic leading-none mt-0.5 truncate',
    lastCompWrapper: 'flex items-center gap-1 mt-1 overflow-hidden',
    lastCompLabel: 'text-[9px] text-white/20 italic font-light shrink-0',
    lastCompValue: 'text-[9px] text-info-bright/60 italic font-medium truncate',
    newPlayerBadge: 'py-0 px-1.5 mt-1 w-fit opacity-60',
    actionWrapper: 'ml-4 shrink-0',
    actionIcon:
      'text-[10px] font-black text-gold/20 group-hover:text-gold transition-default',
  };

  return { name, lastComp, classes };
};
