import type React from 'react';
import { Text } from './Typography';
import { cn } from '../../utils/cn';

interface RankedScoreProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number | string;
  rank: number;
}

const rankSizes: Record<number, string> = {
  1: 'text-2xl md:text-3xl',
  2: 'text-xl md:text-2xl',
  3: 'text-xl md:text-2xl',
};

const rankStyles: Record<number, string> = {
  1: 'text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] animate-pulse-subtle',
  2: 'text-silver drop-shadow-[0_0_8px_rgba(168,168,168,0.3)]',
  3: 'text-bronze drop-shadow-[0_0_8px_rgba(140,89,59,0.3)]',
};

export const RankedScore = ({
  score,
  rank,
  className,
  ...props
}: RankedScoreProps) => {
  const finalSize = rankSizes[rank] || 'text-sm md:text-base';
  const finalStyle = rankStyles[rank] || 'text-white/80';

  return (
    <div
      className={cn('flex items-baseline gap-1 tabular-nums', className)}
      {...props}
    >
      <Text
        as="span"
        variant="mono"
        className={cn(
          'font-black transition-all duration-700',
          finalStyle,
          finalSize,
        )}
      >
        {score}
      </Text>

      <Text as="span" variant="micro" className="text-white/20">
        pts
      </Text>
    </div>
  );
};
