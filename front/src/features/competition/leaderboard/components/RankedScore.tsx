import type React from 'react';
import { Text, TEXT_VARIANT, TEXT_THEME, cn } from '@/shared';
import { useRankedScoreUI } from '@/features/competition/leaderboard/hooks';
import { COMPETITION_UI } from '@/features/competition/constants';

interface RankedScoreProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number | string;
  rank: number;
  isFogActive?: boolean;
  shouldHidePoints?: boolean;
}

export const RankedScore = ({
  score,
  rank,
  isFogActive,
  className,
  shouldHidePoints = false,
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
        variant={TEXT_VARIANT.MONO}
        aria-hidden="true"
        colorTheme={shouldHidePoints ? TEXT_THEME.DIMMED : undefined}
        className={!shouldHidePoints ? scoreClasses : undefined}
      >
        {shouldHidePoints ? COMPETITION_UI.DETAIL.MASKED_POINTS : score}
      </Text>

      <Text
        as="span"
        variant={TEXT_VARIANT.MICRO}
        colorTheme={TEXT_THEME.DIMMED}
        aria-hidden="true"
      >
        {COMPETITION_UI.DETAIL.POINTS_SHORT}
      </Text>
    </div>
  );
};
