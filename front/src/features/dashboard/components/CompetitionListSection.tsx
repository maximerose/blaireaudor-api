import { CompetitionCard } from '@/features/competition';
import {
  SECTION_HEADER_THEME,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Stack,
  Grid,
} from '@/shared';
import type { DashboardItem } from '@/features/dashboard/types';
import { DASHBOARD_UI } from '../constants';

interface CompetitionListSectionProps {
  title: string;
  icon?: string;
  items: DashboardItem[];
  variant?: 'gold' | 'white' | 'dimmed';
  emptyState?: React.ReactNode;
}

export const CompetitionListSection = ({
  title,
  icon,
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
    <Stack as="section" gap="md" className="w-full">
      <SectionHeader
        variant={SECTION_HEADER_VARIANT.DIVIDER}
        colorTheme={themeMap}
        title={title}
        icon={icon}
        badge={DASHBOARD_UI.NB_COMPETITIONS(items.length)}
      />

      <Grid cols={1} lg={2} gap="sm" className="w-full">
        {items?.length > 0
          ? items.map((item) => (
              <CompetitionCard
                key={item.competition.id}
                competition={item.competition}
                participation={item.participation}
              />
            ))
          : emptyState}
      </Grid>
    </Stack>
  );
};
