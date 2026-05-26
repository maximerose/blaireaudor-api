import {
  Card,
  CARD_VARIANT,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  ICONS,
  cn,
} from '@/shared';
import type { MetricItem } from '../hooks/usePlayerStats';

interface StatCardProps {
  metric: MetricItem;
  onClick?: () => void;
}

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
        className="text-center h-full relative"
      >
        {metric.hint && (
          <span
            className="absolute top-1 right-2 text-[7px] text-gold/30 group-hover:text-gold/80 transition-default"
            aria-hidden="true"
          >
            {ICONS.HINT}
          </span>
        )}
        <span className="text-sm mb-1 opacity-30" aria-hidden="true">
          {metric.icon}
        </span>
        <Text
          variant={TEXT_VARIANT.H3}
          className={`font-black text-sm sm:text-base leading-none ${metric.color}`}
        >
          {metric.val}
        </Text>
        <Text
          variant={TEXT_VARIANT.MICRO}
          colorTheme={TEXT_THEME.DIMMED}
          className="mt-1 leading-tight text-[7px] tracking-wider block w-full"
        >
          {metric.label}
        </Text>
      </Card.Body>
    </Card>
  );
};
