import { CHART_COLORS, CHART_ME_COLOR } from '@/features/stats/constants';
import type { CompetitionChartLegendProps } from '@/features/stats/types';
import { cn } from '@/shared';

export const CompetitionChartLegend = ({
  leaderboard,
  hiddenLines,
  myPlayerId,
  onLegendClick,
}: CompetitionChartLegendProps) => {
  return (
    <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 pt-6 px-4 w-full border-t border-border-subtle mt-4">
      {leaderboard.map((item, index) => {
        const isHidden = hiddenLines[item.player.id];
        const isMe = item.player.id === myPlayerId;
        const color = isMe
          ? CHART_ME_COLOR
          : CHART_COLORS[index % CHART_COLORS.length];

        return (
          <li
            key={item.player.id}
            onClick={() => onLegendClick(item.player.id)}
            className={cn(
              'flex items-center gap-2 text-xs transition-default cursor-pointer select-none',
              isHidden
                ? 'opacity-25 grayscale hover:opacity-50'
                : 'opacity-100 hover:opacity-80',
            )}
          >
            <span
              className="w-3 h-3 rounded-full shadow-sm shrink-0"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <span
              className={cn(
                'font-medium text-sm truncate max-w-32 capitalize',
                isHidden ? 'text-text-dimmed line-through' : 'text-silver',
              )}
            >
              {item.player.display_name}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
