import { Text } from '@/components/UI';
import { BUTTONS, COMPETITION_UI, ICONS } from '@/constants';
import { useActionRow, useCompetition } from '@/hooks';
import { ActionStatus, type Action, type OnActionStatusChange } from '@/types';
import { cn, formatShortDate } from '@/utils';

interface ActionRowDisplayModeProps {
  action: Action;
  playerName: string;
  isPending: boolean;
  onEdit: () => void;
  onStatusChange: OnActionStatusChange;
}

export const ActionRowDisplayMode = ({
  action,
  playerName,
  isPending,
  onEdit,
  onStatusChange,
}: ActionRowDisplayModeProps) => {
  const { isAdmin, hidePoints } = useCompetition();
  const { displayColor, pointsDisplay, multiplier } = useActionRow(action);

  return (
    <div className="grid grid-cols-12 gap-2 p-4 items-center hover:bg-white/2 transition-default group relative">
      {/* Date */}
      <div className="col-span-3 md:col-span-2">
        <Text variant="mono" className="text-[10px] text-white/40">
          {formatShortDate(action.date_action)}
        </Text>
      </div>

      {/* Corps de l'action */}
      <div className="col-span-6 md:col-span-8 flex flex-col md:grid md:grid-cols-8 items-center overflow-hidden">
        <Text
          variant="h3"
          className="md:col-span-3 truncate italic text-xs group-hover:text-gold transition-default"
        >
          {playerName}
        </Text>

        <div className="md:col-span-5 flex flex-col">
          <Text
            variant="body"
            className="text-[10px] md:text-xs text-white italic truncate"
          >
            "{action.description}"
          </Text>
          {action.creator_name && (
            <Text
              variant="body"
              className="text-[8px] md:text-[10px] text-white/50"
            >
              {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.REPORTED_BY}
              <span className="text-info-bright">{action.creator_name}</span>
            </Text>
          )}

          {/* Boutons de Modération */}
          {isPending && isAdmin && (
            <div className="mt-2 flex justify-center gap-4 animate-fade-in">
              <button
                onClick={() =>
                  onStatusChange(action.id, ActionStatus.VALIDATED)
                }
                className="text-[10px] font-black text-success hover:underline uppercase tracking-widest"
              >
                {BUTTONS.ACCEPT} {ICONS.CHECK}
              </button>
              <button
                onClick={() => onStatusChange(action.id, ActionStatus.REJECTED)}
                className="text-[10px] font-black text-danger hover:underline uppercase tracking-widest"
              >
                {BUTTONS.REJECT} {ICONS.CANCEL}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Points */}
      <div className="col-span-3 md:col-span-2 text-right flex flex-col items-end">
        {multiplier > 1 && !hidePoints && (
          <Text variant="mono" className="text-[9px] line-through opacity-30">
            {action.points} {COMPETITION_UI.DETAIL.POINTS_SHORT}
          </Text>
        )}
        <Text
          variant="mono"
          className={cn('text-sm md:text-base font-black', displayColor)}
        >
          {pointsDisplay}{' '}
          <span className="text-[8px] opacity-50">
            {COMPETITION_UI.DETAIL.POINTS_SHORT}
          </span>
        </Text>
      </div>

      {/* Bouton Edit (Flottant) */}
      {isPending && isAdmin && (
        <button
          onClick={onEdit}
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-default"
        >
          {ICONS.EDIT}
        </button>
      )}
    </div>
  );
};
