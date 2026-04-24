import { Text } from '@/components/UI';

interface DashboardHeaderProps {
  displayName?: string;
  totalParticipations: number;
  stats: { active: number; upcoming: number; finished: number };
}

export const DashboardHeader = ({
  displayName,
  totalParticipations,
  stats,
}: DashboardHeaderProps) => {
  const statItems = [
    { label: 'En cours', val: stats.active, color: 'text-success-bright' },
    { label: 'À venir', val: stats.upcoming, color: 'text-info-bright' },
    { label: 'Terminées', val: stats.finished, color: 'text-white/20' },
  ];

  return (
    <section className="space-y-4" aria-labelledby="dashboard-title">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div className="space-y-4">
          <Text
            variant="caption"
            className="text-gold uppercase font-bold tracking-widest"
          >
            Tableau de bord
          </Text>

          <Text
            id="dashboard-title"
            variant="h1"
            className="text-white normal-case"
          >
            Salut, <span className="text-gold">{displayName}</span>
          </Text>
        </div>

        <div className="pt-4 sm:pt-0 border-t border-white/5 sm:border-0 text-center align-middle">
          <Text variant="caption" className="text-white/40">
            {totalParticipations > 0
              ? `${totalParticipations} participation${totalParticipations > 1 ? 's' : ''} au total`
              : 'Aucune compétition active'}
          </Text>
        </div>

        <div
          className="flex justify-center gap-3"
          role="list"
          aria-label="Résumé de vos compétitions"
        >
          {statItems.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center"
              role="listitem"
            >
              <span
                className={`text-lg sm:text-xl font-black leading-none ${s.color}`}
                aria-hidden="true"
              >
                {s.val}
              </span>
              <Text variant="micro" className="mt-0.5" aria-hidden="true">
                {s.label}
              </Text>
              <span className="sr-only">
                {s.val} {s.val > 1 ? 'compétitions' : 'compétition'}{' '}
                {s.label.toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
