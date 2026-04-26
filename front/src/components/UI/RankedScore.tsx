import type React from 'react';
import { Text } from '@/components/UI';
import { cn } from '@/utils';
import { useRankedScoreUI } from '@/hooks';

interface RankedScoreProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number | string;
  rank: number;
  isFogActive?: boolean;
}

export const RankedScore = ({
  score,
  rank,
  isFogActive,
  className,
  ...props
}: RankedScoreProps) => {
  const { ariaLabel, scoreClasses } = useRankedScoreUI(
    score,
    isFogActive ? 4 : rank,
  );
  return (
    <div
      className={cn('flex items-baseline gap-1 tabular-nums', className)}
      role="group"
      aria-label={ariaLabel}
      {...props}
    >
      <Text
        as="span"
        variant="mono"
        aria-hidden="true"
        className={scoreClasses}
      >
        {score}
      </Text>

      <Text
        as="span"
        variant="micro"
        className="text-white/20"
        aria-hidden="true"
      >
        pts
      </Text>
    </div>
  );
};
