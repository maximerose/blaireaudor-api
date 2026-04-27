import { Text } from '@/components/UI';
import { cn, formatShortDate } from '@/utils';

export const ActionRowDisplayMode = ({
  action,
  playerName,
  displayPoints,
  displayColor,
  isPending,
  isAdmin,
  onEdit,
  onStatusChange,
}: any) => (
  <div className="grid grid-cols-12 gap-2 p-4 items-center hover:bg-white/2 transition-default group relative">
    {/* Date */}
    <div className="col-span-3 md:col-span-2">
      <Text variant="mono" className="text-[10px] text-white/40">
        {formatShortDate(action.date_action)}
      </Text>
    </div>

    {/* Corps de l'action */}
    <div className="col-span-6 md:col-span-8 flex flex-col md:grid md:grid-cols-8 overflow-hidden">
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
        <Text
          variant="body"
          className="text-[8px] md:text-[10px] text-white/50"
        >
          Dénoncé par :{' '}
          <span className="text-info-bright">{action.creator_name}</span>
        </Text>

        {/* Boutons de Modération */}
        {isPending && isAdmin && (
          <div className="mt-2 flex gap-4 animate-fade-in border-l border-white/10 pl-3">
            <button
              onClick={() => onStatusChange(action.id, 'validated')}
              className="text-[10px] font-black text-success hover:underline uppercase tracking-widest"
            >
              Accepter ✓
            </button>
            <button
              onClick={() => onStatusChange(action.id, 'rejected')}
              className="text-[10px] font-black text-danger hover:underline uppercase tracking-widest"
            >
              Refuser ✕
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Points */}
    <div className="col-span-3 md:col-span-2 text-right">
      <Text
        variant="mono"
        className={cn('text-sm md:text-base font-black', displayColor)}
      >
        {displayPoints} <span className="text-[8px] opacity-50">pts</span>
      </Text>
    </div>

    {/* Bouton Edit (Flottant) */}
    {isPending && isAdmin && (
      <button
        onClick={onEdit}
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-default"
      >
        ✏️
      </button>
    )}
  </div>
);
