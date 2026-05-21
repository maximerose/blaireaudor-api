import {
  Badge,
  BADGE_VARIANT,
  Text,
  TEXT_VARIANT,
  BUTTONS,
  ICONS,
} from '@/shared';
import type { PlayerCompact } from '@/features/player';

interface SelectedPlayerBadgeProps {
  player: PlayerCompact;
  onRemove: (id: string) => void;
}

export const SelectedPlayerBadge = ({
  player,
  onRemove,
}: SelectedPlayerBadgeProps) => {
  return (
    <Badge
      role="listitem"
      variant={BADGE_VARIANT.GOLD}
      className="pl-3 pr-1 py-1 animate-fade-in flex items-center gap-2"
    >
      <Text variant={TEXT_VARIANT.MICRO} className="opacity-100 font-black">
        {player.display_name}
      </Text>
      <button
        type="button"
        onClick={() => onRemove(player.id)}
        className="w-5 h-5 rounded-full flex items-center justify-center text-gold/40 hover:bg-danger/20 hover:text-danger-bright transition-default cursor-pointer"
        aria-label={`Retirer ${player.display_name}`}
        title={BUTTONS.REMOVE}
      >
        <span aria-hidden="true">{ICONS.CANCEL}</span>
      </button>
    </Badge>
  );
};
