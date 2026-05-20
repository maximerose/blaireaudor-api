import {
  Badge,
  BADGE_VARIANT,
  Text,
  TEXT_VARIANT,
  FORM,
  ICONS,
  cn,
} from '@/shared';
import type { PlayerCompact } from '@/types';

interface SelectedPlayersListProps {
  participants: PlayerCompact[];
  onRemove?: (id: string) => void;
}

export const SelectedPlayersList = ({
  participants,
  onRemove,
}: SelectedPlayersListProps) => (
  <div
    className={cn(
      'flex flex-wrap gap-2 min-h-16 p-4 rounded-2xl border transition-default',
      participants.length > 0
        ? 'bg-gold/5 border-gold/20'
        : 'bg-dark/30 border-white/5',
    )}
    role="list"
    aria-live="polite"
    aria-label={FORM.ADMIN.ENROLLMENT.SELECTED_PLAYERS}
  >
    {participants.length > 0 ? (
      participants.map((p) => (
        <Badge
          key={p.id}
          role="listitem"
          variant={BADGE_VARIANT.GOLD}
          className="animate-fade-in py-1 px-3 flex items-center gap-2"
        >
          {p.display_name}

          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(p.id);
              }}
              aria-label={`Supprimer ${p.display_name}`}
              className="text-gold/40 hover:text-danger-bright transition-default text-[11px]"
            >
              {ICONS.CANCEL}
            </button>
          )}
        </Badge>
      ))
    ) : (
      <Text variant={TEXT_VARIANT.MICRO} className="m-auto opacity-20">
        {FORM.ADMIN.ENROLLMENT.NO_PLAYER_SELECTED_HINT}
      </Text>
    )}
  </div>
);
