import { cn } from '@/utils';

interface Player {
  id: string;
  displayName?: string;
  display_name?: string;
  username: string;
  lastCompetitionName?: string;
  last_competition_name?: string;
}

export const usePlayerSearchResultUI = (player: Player, className: string) => {
  const name = player.display_name || player.displayName;
  const lastComp = player.last_competition_name || player.lastCompetitionName;

  const itemClasses = cn(
    'w-full text-left p-3 hover:bg-gold/5 rounded-xl transition-default flex justify-between items-center group border border-transparent hover:border-gold/10',
    'focus:outline-none focus:bg-gold/10 focus:border-gold/20',
    className,
  );

  const actionIconClasses =
    'text-[10px] font-black text-gold/20 group-hover:text-gold transition-default';

  return { name, lastComp, itemClasses, actionIconClasses };
};
