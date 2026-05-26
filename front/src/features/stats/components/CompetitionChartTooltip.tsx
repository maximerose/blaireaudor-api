import { formatShortDate } from '@/shared';
import type { CompetitionChartTooltipProps } from '@/features/stats/types';

export const CompetitionChartTooltip = ({
  active,
  payload,
  label,
  isPointsMode,
}: CompetitionChartTooltipProps) => {
  if (active && payload && payload.length) {
    const rawScores = payload[0].payload.rawScores as Record<string, number>;

    return (
      <div className="bg-dark-lighter border border-gold/20 p-3 rounded-xl shadow-xl z-50">
        <p className="text-gold font-bold mb-2 uppercase text-xs">
          {formatShortDate(label as string)}
        </p>
        {[...payload]
          .sort((a, b) => {
            const valA = Number(a.value) || 0;
            const valB = Number(b.value) || 0;
            return isPointsMode ? valB - valA : valA - valB;
          })
          .map((entry) => {
            const dataKey = String(entry.dataKey);
            const score = isPointsMode ? entry.value : rawScores[dataKey] || 0;
            const rankText = isPointsMode ? `${score} pts` : `#${entry.value}`;
            const secondaryText = isPointsMode ? '' : `${score} pts`;
            return (
              <div
                key={entry.dataKey}
                className="flex justify-between gap-6 text-xs mb-1"
                style={{ color: entry.color }}
              >
                <span className="font-bold truncate max-w-32">
                  {entry.name}
                </span>
                <span className="font-mono text-white/80 shrink-0">
                  <span className="text-xs opacity-80 font-bold mr-1.5">
                    {rankText}
                  </span>
                  {secondaryText && (
                    <span className="opacity-50 text-[10px]">
                      {secondaryText}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
      </div>
    );
  }
  return null;
};
