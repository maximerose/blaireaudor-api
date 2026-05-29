import type { StatCardProps } from '@/features/stats/types';
import {
  Card,
  CARD_VARIANT,
  cn,
  ICONS,
  Text,
  TEXT_THEME,
  TEXT_VARIANT,
} from '@/shared';

export const StatCard = ({ metric, onClick }: StatCardProps) => {
  const hasHint = !!metric.hint;

  return (
    <Card
      variant={CARD_VARIANT.DARK}
      onClick={onClick}
      isHoverable={hasHint}
      hoverVariant={hasHint ? 'info' : 'gold'}
      className="border-border-subtle bg-surface-base/30 relative group"
    >
      <Card.Body
        p="sm"
        align="center"
        justify="center"
        className="text-center h-full relative flex flex-col justify-between"
      >
        {metric.hint && (
          <span
            className="absolute top-2 right-2 text-sm text-info-bright/50 group-hover:text-info-bright transition-default"
            aria-hidden="true"
          >
            {ICONS.HINT}
          </span>
        )}
        <Text
          colorTheme={TEXT_THEME.MUTED}
          className="text-md"
          aria-hidden="true"
        >
          {metric.icon}
        </Text>

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
          colorTheme={TEXT_THEME.MUTED}
          className="mt-3 block w-full"
        >
          {metric.label}
        </Text>
      </Card.Body>
    </Card>
  );
};
