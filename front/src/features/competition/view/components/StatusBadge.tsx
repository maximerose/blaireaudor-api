import { Badge, BADGE_VARIANT } from '@/shared';
import {
  CompetitionStatus,
  type CompetitionStatusType,
} from '@/features/competition/types';

const STATUS_CONFIG = {
  [CompetitionStatus.ACTIVE]: {
    variant: BADGE_VARIANT.SUCCESS,
    isPulse: true,
    ariaLabel: 'Compétition actuellement en cours',
    label: 'En cours',
  },
  [CompetitionStatus.UPCOMING]: {
    variant: BADGE_VARIANT.INFO,
    isPulse: false,
    ariaLabel: 'Compétition à venir',
    label: 'À venir',
  },
  [CompetitionStatus.FINISHED]: {
    variant: BADGE_VARIANT.DANGER,
    isPulse: false,
    ariaLabel: 'Compétition terminée',
    label: 'Terminé',
  },
} as const;

export const StatusBadge = ({ status }: { status: CompetitionStatusType }) => {
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
