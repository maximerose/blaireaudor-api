import { Badge } from '@/components/UI';
import { CompetitionStatus } from '@/utils';

type StatusType = (typeof CompetitionStatus)[keyof typeof CompetitionStatus];

const STATUS_CONFIG = {
  [CompetitionStatus.ACTIVE]: {
    variant: 'success' as const,
    isPulse: true,
    ariaLabel: 'Compétition actuellement en cours',
    label: 'En cours',
  },
  [CompetitionStatus.UPCOMING]: {
    variant: 'info' as const,
    isPulse: false,
    ariaLabel: 'Compétition à venir',
    label: 'À venir',
  },
  [CompetitionStatus.FINISHED]: {
    variant: 'danger' as const,
    isPulse: false,
    ariaLabel: 'Compétition terminée',
    label: 'Terminé',
  },
};

export const StatusBadge = ({ status }: { status: StatusType }) => {
  const config = STATUS_CONFIG[status];

  if (!config) return null;

  return (
    <span role="status" aria-relevant="all">
      <Badge
        variant={config.variant}
        isPulse={config.isPulse}
        aria-label={config.ariaLabel}
      >
        {config.label}
      </Badge>
    </span>
  );
};
