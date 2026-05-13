import { Text } from '@/components/UI';
import { BUTTONS, COMPETITION_UI, ICONS } from '@/constants';
import { useActionRow, useCompetition, useCompetitionAdmin } from '@/hooks';
import { ActionStatus, type Action } from '@/types';
import { cn, formatShortDate } from '@/utils';

interface ActionRowDisplayModeProps {
  action: Action;
  onEdit: () => void;
}

export const ActionRowDisplayMode = ({
  action,
  onEdit,
}: ActionRowDisplayModeProps) => {
  const { handleActionStatus } = useCompetitionAdmin();
  const { competition, isAdmin, hidePoints } = useCompetition();
  const {
    displayColor,
    pointsDisplay,
    multiplier,
    playerIsMe,
    creatorIsMe,
    playerName,
    isPending,
  } = useActionRow(action);

  return (
    <div
      className={cn(
        'grid grid-cols-12 gap-2 p-4 items-center transition-default group relative',
        playerIsMe
          ? 'bg-player-me-bg hover:bg-player-me/7'
          : 'hover:bg-white/2',
      )}
    >
      {/* Date */}
      <div className="col-span-3 md:col-span-2">
        <Text variant="mono" className="text-[10px] text-white/40">
          {formatShortDate(action.date_action)}
        </Text>
      </div>

      {/* Corps de l'action */}
      <div className="col-span-6 md:col-span-8 flex flex-col md:grid md:grid-cols-8 items-center overflow-hidden">
        <div className="md:col-span-3 flex items-center justify-center gap-2 overflow-hidden">
          <Text
            variant="h3"
            className={cn(
              'truncate italic text-xs text-player-other transition-default',
              playerIsMe && 'text-player-me',
            )}
          >
            {playerName}
          </Text>
        </div>

        <div className="md:col-span-5 flex flex-col">
          <Text
            variant="body"
            className="text-[10px] md:text-xs text-info-bright"
          >
            {action.description}
          </Text>
          {action.creator_name && (
            <Text
              variant="body"
              className="text-[8px] md:text-[10px] text-silver"
            >
              {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.REPORTED_BY}
              <span
                className={cn(
                  'font-bold',
                  'text-player-other',
                  creatorIsMe && 'text-player-me',
                )}
              >
                {action.creator_name}
              </span>
            </Text>
          )}

          {/* Boutons de Modération */}
          {isPending && isAdmin && !competition.is_finished && (
            <div className="mt-2 flex justify-center gap-4 animate-fade-in">
              <button
                onClick={() =>
                  handleActionStatus(action.id, ActionStatus.VALIDATED)
                }
                className="text-[10px] font-black text-success hover:underline uppercase tracking-widest"
              >
                {BUTTONS.ACCEPT} {ICONS.CHECK}
              </button>
              <button
                onClick={() =>
                  handleActionStatus(action.id, ActionStatus.REJECTED)
                }
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
          <div className="flex items-center gap-1">
            <Text variant="mono" className="text-[9px] line-through opacity-40">
              {action.points}
            </Text>
            <span className="text-[8px] font-black text-game-bonus-bright bg-game-bonus/20 px-1 rounded">
              x{multiplier}
            </span>
          </div>
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
      {isAdmin && !competition.is_finished && (
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
