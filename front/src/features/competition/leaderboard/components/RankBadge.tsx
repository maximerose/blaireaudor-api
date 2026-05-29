import { COMPETITION_UI } from '@/features/competition/constants';
import { useRankBadgeUI } from '@/features/competition/leaderboard/hooks';
import { Badge, cn, Row } from '@/shared';
import type React from 'react';

interface RankBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  rank: number;
}

export const RankBadge = ({ rank, className, ...props }: RankBadgeProps) => {
  const { medal, suffix, srText, variant, badgeShadow, medalShadow } =
    useRankBadgeUI(rank);

  return (
    <Row
      align="center"
      gap="sm"
      className={className}
      {...props}
      role="group"
      aria-label={COMPETITION_UI.DETAIL.SECTIONS.LEADERBOARD.ARIA_RANK(
        rank,
        suffix,
      )}
      fullWidth={false}
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

      <Badge variant={variant} className={cn('font-black italic', badgeShadow)}>
        <span className="flex items-baseline" aria-hidden="true">
          {rank}
          <span className="text-xs lowercase ml-0.5 opacity-80 font-bold">
            {suffix}
          </span>
        </span>
        <span className="sr-only">{srText}</span>
      </Badge>
    </Row>
  );
};
