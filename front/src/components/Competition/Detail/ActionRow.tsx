import { cn, formatShortDate } from '@/utils';
import { Badge, Text } from '@/components/UI';
import { useActionRow } from '@/hooks';

export const ActionRow = ({ action }: { action: any }) => {
  const { isPending, pointsDisplay, pointsColorClass, playerName } =
    useActionRow(action);

  return (
    <div
      role="row"
      className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-white/2 transition-default group"
    >
      <div className="col-span-3 md:col-span-2" role="cell">
        <Text
          variant="mono"
          className="text-[10px] text-white/40 group-hover:text-white/60 transition-default"
        >
          {formatShortDate(action.date_action)}
        </Text>
      </div>

      <div
        className="col-span-6 md:col-span-8 flex flex-col items-center md:grid md:grid-cols-8 md:gap-4 overflow-hidden"
        role="cell"
      >
        <div className="flex items-center justify-center md:col-span-3 overflow-hidden w-full">
          <Text
            variant="h3"
            className="text-white truncate normal-case italic text-xs transition-default group-hover:text-gold"
          >
            {playerName}
          </Text>
        </div>

        <div className="flex flex-col items-center md:col-span-5 w-full">
          <Text
            variant="body"
            className="text-[10px] md:text-xs text-white/50 italic md:text-white/70 w-full text-center truncate transition-default"
            title={action.description}
          >
            "{action.description}"
          </Text>

          {isPending && (
            <Badge
              variant="warning"
              isPulse
              className="mt-1"
              aria-label="Action en attente de validation"
            >
              En attente
            </Badge>
          )}
        </div>
      </div>

      <div className="col-span-3 md:col-span-2 text-right" role="cell">
        <Text
          variant="mono"
          className={cn(
            'text-sm md:text-base font-black transition-default',
            pointsColorClass,
          )}
        >
          {pointsDisplay}
          <Text variant="micro" as="span" className="ml-1 opacity-50 lowercase">
            pts
          </Text>
        </Text>
      </div>
    </div>
  );
};
