import {
  Card,
  CARD_VARIANT,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  ICONS,
  cn,
} from '@/shared';
import type { StatCardProps } from '@/features/stats/types';

export const StatCard = ({ metric, onClick }: StatCardProps) => {
  return (
    <Card
      variant={CARD_VARIANT.DARK}
      onClick={onClick}
      isHoverable={!!metric.hint}
      className={cn(
        'border-border-subtle bg-surface-base/30 relative',
        metric.hint && 'hover:border-gold/40 group',
      )}
    >
      <Card.Body
        p="sm"
        align="center"
        justify="center"
        className="text-center h-full relative flex flex-col justify-between"
      >
        {metric.hint && (
          <span
            className="absolute top-2 right-2 text-xs text-gold/30 group-hover:text-gold/80 transition-default"
            aria-hidden="true"
          >
            {ICONS.HINT}
          </span>
        )}
        <span className="text-lg mb-2 opacity-30" aria-hidden="true">
          {metric.icon}
        </span>

        <div className="flex flex-col items-center justify-center flex-1 w-full">
          <Text
            variant={TEXT_VARIANT.H3}
            className={cn(
              'font-black capitalize leading-none flex items-baseline justify-center',
              metric.color,
            )}
          >
            {metric.val}
          </Text>
          {metric.subtext && (
            <Text
              variant={TEXT_VARIANT.MICRO}
              colorTheme={TEXT_THEME.DIMMED}
              className="mt-2 font-medium normal-case italic"
            >
              {metric.subtext}
            </Text>
          )}
        </div>

        <Text
          variant={TEXT_VARIANT.MICRO}
          colorTheme={TEXT_THEME.DIMMED}
          className="mt-3 block w-full"
        >
          {metric.label}
        </Text>
      </Card.Body>
    </Card>
  );
};
