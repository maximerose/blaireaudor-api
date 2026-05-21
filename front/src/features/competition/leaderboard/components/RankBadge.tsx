import type React from 'react';
import { Badge, cn } from '@/shared';
import { useRankBadgeUI } from '@/features/competition/leaderboard/hooks';

interface RankBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  rank: number;
}

export const RankBadge = ({ rank, className, ...props }: RankBadgeProps) => {
  const { medal, suffix, srText, variant, badgeShadow, medalShadow } =
    useRankBadgeUI(rank);

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      {...props}
      role="group"
      aria-label={`Rang : ${rank}${suffix}`}
    >
      {medal && (
        <span
          className={cn(
            'text-2xl animate-bounce-subtle motion-reduce:animate-none',
            medalShadow,
          )}
          aria-hidden="true"
        >
          {medal}
        </span>
      )}

      <Badge
        variant={variant}
        className={cn(
          'px-2.5 py-0.5 text-[10px] font-black italic transition-default',
          badgeShadow,
        )}
      >
        <span className="flex items-baseline" aria-hidden="true">
          {rank}
          <span className="text-[7px] lowercase ml-0.5 opacity-70 font-bold">
            {suffix}
          </span>
        </span>
        <span className="sr-only">{srText}</span>
      </Badge>
    </div>
  );
};
