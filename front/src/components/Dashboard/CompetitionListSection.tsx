import { Text } from '@/components/UI';
import { CompetitionCard } from '@/components/Dashboard';
import { cn } from '@/utils';
import type { DashboardItem } from '@/types';

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

  return (
    <section className="space-y-4">
      {/* Header de section */}
      <div className="flex items-center justify-between px-1">
        <Text
          variant="caption"
          className={cn(
            'uppercase font-bold tracking-widest',
            variant === 'gold'
              ? 'text-gold opacity-60'
              : variant === 'dimmed'
                ? 'opacity-20'
                : 'opacity-40',
          )}
        >
          {title}
        </Text>
        <div
          className={cn(
            'h-px flex-1 ml-4',
            variant === 'gold'
              ? 'bg-gold/10'
              : variant === 'dimmed'
                ? 'bg-white/2'
                : 'bg-white/5',
          )}
        />
      </div>

      {/* Liste ou EmptyState */}
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
