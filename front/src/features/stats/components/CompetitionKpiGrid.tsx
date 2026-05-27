import { Stack, Text, TEXT_VARIANT, TEXT_THEME, cn } from '@/shared';
import { StatCard } from './StatCard';
import type { KpiGridProps } from '@/features/stats/types';

export const CompetitionKpiGrid = ({
  categories,
  onCardClick,
}: KpiGridProps) => {
  return (
    <Stack gap="lg" className="w-full mt-4">
      {categories.map((cat, index) => {
        const isEven = cat.metrics.length % 2 === 0;

        return (
          <Stack key={index} gap="xs" className="w-full">
            <Text variant={TEXT_VARIANT.MICRO} colorTheme={TEXT_THEME.MUTED}>
              {cat.title}
            </Text>
            <div
              className={cn(
                'grid gap-2 w-full',
                isEven ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3',
                isEven && cat.metrics.length === 4
                  ? 'md:grid-cols-4'
                  : isEven
                    ? 'md:grid-cols-2'
                    : '',
              )}
            >
              {cat.metrics.map((m) => (
                <StatCard
                  key={m.label}
                  metric={m}
                  onClick={m.hint ? () => onCardClick(m.hint!) : undefined}
                />
              ))}
            </div>
          </Stack>
        );
      })}
    </Stack>
  );
};
