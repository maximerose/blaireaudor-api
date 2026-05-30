import { COMPETITION_STATS_GENERAL } from '@/features/stats/constants';
import { useProgressBannerUI } from '@/features/stats/hooks';
import type { ProgressBannerProps } from '@/features/stats/types';
import {
  SECTION_HEADER_THEME,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Stack,
} from '@/shared';
import { StatCard } from './StatCard';

export const CompetitionProgressBanner = ({
  myParticipation,
  leaderboard,
  myPlayerId,
  totalPoints,
  onCardClick,
}: ProgressBannerProps) => {
  const { metrics } = useProgressBannerUI({
    myParticipation,
    leaderboard,
    myPlayerId,
    totalPoints,
  });

  return (
    <Stack gap="sm" className="w-full animate-fade-in">
      <SectionHeader
        variant={SECTION_HEADER_VARIANT.DIVIDER}
        colorTheme={SECTION_HEADER_THEME.DEFAULT}
        title={COMPETITION_STATS_GENERAL.PROGRESS_BANNER.TITLE}
      />

      <div className="grid gap-2 w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m) => (
          <StatCard
            key={m.id}
            metric={m}
            onClick={m.hint ? () => onCardClick(m.hint!) : undefined}
          />
        ))}
      </div>
    </Stack>
  );
};
