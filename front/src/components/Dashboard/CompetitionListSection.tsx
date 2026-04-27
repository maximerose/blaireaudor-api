import { Text } from '@/components/UI';
import { CompetitionCard } from './CompetitionCard';
import { cn } from '@/utils';

interface CompetitionListSectionProps {
  title: string;
  competitions?: any[];
  participations?: any[];
  user: any;
  variant?: 'gold' | 'white';
  emptyState?: React.ReactNode;
}

export const CompetitionListSection = ({
  title,
  competitions,
  participations,
  user,
  variant = 'white',
  emptyState,
}: CompetitionListSectionProps) => {
  const hasData =
    (competitions?.length || 0) > 0 || (participations?.length || 0) > 0;

  if (!hasData && !emptyState) return null;

  return (
    <section className="space-y-4">
      {/* Header de section */}
      <div className="flex items-center justify-between px-1">
        <Text
          variant="caption"
          className={cn(
            'uppercase font-bold tracking-widest',
            variant === 'gold' ? 'text-gold opacity-60' : 'opacity-40',
          )}
        >
          {title}
        </Text>
        <div
          className={cn(
            'h-px flex-1 ml-4',
            variant === 'gold' ? 'bg-gold/10' : 'bg-white/5',
          )}
        />
      </div>

      {/* Liste ou EmptyState */}
      <div className="grid gap-3">
        {hasData ? (
          <>
            {/* Si on passe des compétitions (ex: Managed) */}
            {competitions?.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} user={user} />
            ))}
            {/* Si on passe des participations (ex: Joueur) */}
            {participations?.map((p) => (
              <CompetitionCard
                key={p.competition.id}
                participation={p}
                competition={p.competition}
                user={user}
              />
            ))}
          </>
        ) : (
          emptyState
        )}
      </div>
    </section>
  );
};
