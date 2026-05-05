import { Badge, Text } from '@/components/UI';
import { ICONS } from '@/constants';

interface SelectedPlayerBadgeProps {
  player: any;
  onRemove: (id: string) => void;
}

export const SelectedPlayerBadge = ({
  player,
  onRemove,
}: SelectedPlayerBadgeProps) => {
  return (
    <Badge
      role="listitem"
      variant="gold"
      className="pl-3 pr-1 py-1 animate-fade-in flex items-center gap-2"
    >
      <Text variant="micro" className="opacity-100 font-black">
        {player.display_name}
      </Text>
      <button
        type="button"
        onClick={() => onRemove(player.id)}
        className="w-5 h-5 rounded-full flex items-center justify-center text-gold/40 hover:bg-danger/20 hover:text-danger-bright transition-default cursor-pointer"
        aria-label={`Retirer ${player.display_name}`}
        title="Retirer"
      >
        <span aria-hidden="true">{ICONS.CANCEL}</span>
      </button>
    </Badge>
  );
};
