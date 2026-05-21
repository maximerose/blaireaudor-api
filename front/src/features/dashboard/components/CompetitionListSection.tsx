import { CompetitionCard } from '@/features/competition';
import {
  Badge,
  BADGE_VARIANT,
  SECTION_HEADER_THEME,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  UI,
} from '@/shared';
import type { DashboardItem } from '@/features/dashboard/types';

interface CompetitionListSectionProps {
  title: string;
  items: DashboardItem[];
  variant?: 'gold' | 'white' | 'dimmed';
  emptyState?: React.ReactNode;
}

export const CompetitionListSection = ({
  title,
  items,
  variant = 'white',
  emptyState,
}: CompetitionListSectionProps) => {
  if (items?.length === 0 && !emptyState) return null;

  const themeMap =
    variant === 'gold'
      ? SECTION_HEADER_THEME.GOLD
      : variant === 'dimmed'
        ? SECTION_HEADER_THEME.DIMMED
        : SECTION_HEADER_THEME.DEFAULT;

  return (
    <section className="space-y-4">
      <SectionHeader
        variant={SECTION_HEADER_VARIANT.DIVIDER}
        colorTheme={themeMap}
        title={title}
        rightElement={
          <Badge
            variant={BADGE_VARIANT.GHOST}
            className="opacity-60 text-[8px]"
          >
            {UI.ENTRIES(items.length)}
          </Badge>
        }
      />

      <div className="grid lg:grid-cols-2 gap-3">
        {items?.length > 0
          ? items?.map((item) => (
              <CompetitionCard
                key={item.competition.id}
                competition={item.competition}
                participation={item.participation}
              />
            ))
          : emptyState}
      </div>
    </section>
  );
};
