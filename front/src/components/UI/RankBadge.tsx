import type React from 'react';
import { getRankMedal } from '../../utils/rankStyles';
import { Badge, type BadgeVariant } from './Badge';
import { cn } from '../../utils/cn';

interface RankBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  rank: number;
}

const rankVariants: Record<number, BadgeVariant> = {
  1: 'gold',
  2: 'silver',
  3: 'bronze',
};

const badgeShadows: Record<number, string> = {
  1: 'shadow-[0_0_12px_rgba(212,175,55,0.25)] border-gold/30',
  2: 'shadow-[0_0_10px_rgba(168,168,168,0.20)] border-silver/30',
  3: 'shadow-[0_0_10px_rgba(140,89,59,0.20)] border-bronze/30',
};

const medalShadows: Record<number, string> = {
  1: 'drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]',
  2: 'drop-shadow-[0_0_8px_rgba(168,168,168,0.4)]',
  3: 'drop-shadow-[0_0_8px_rgba(140,89,59,0.4)]',
};

export const RankBadge = ({ rank, className, ...props }: RankBadgeProps) => {
  const medal = getRankMedal(rank);
  const suffix = rank === 1 ? 'er' : 'ème';

  const variant = rankVariants[rank] || 'ghost';
  const badgeShadow = badgeShadows[rank] || 'opacity-60 border-white/5';
  const medalShadow = medalShadows[rank] || '';

  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      {medal && (
        <span
          className={cn('text-2xl animate-bounce-subtle', medalShadow)}
          role="img"
          aria-label={`médaille ${variant}`}
        >
          {medal}
        </span>
      )}

      <Badge
        variant={variant}
        className={cn(
          'px-2.5 py-0.5 text-[10px] font-black italic transition-all duration-500',
          badgeShadow,
        )}
      >
        <span className="flex items-baseline">
          {rank}
          <span className="text-[7px] lowercase ml-0.5 opacity-70 font-bold">
            {suffix}
          </span>
        </span>
      </Badge>
    </div>
  );
};
