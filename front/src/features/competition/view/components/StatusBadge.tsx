import {
  CompetitionStatus,
  type CompetitionStatusType,
} from '@/features/competition/types';
import { Badge, BADGE_VARIANT, ICONS } from '@/shared';

const STATUS_CONFIG = {
  [CompetitionStatus.ACTIVE]: {
    variant: BADGE_VARIANT.SUCCESS,
    icon: ICONS.ONGOING,
    isPulse: true,
    ariaLabel: 'Compétition actuellement en cours',
    label: 'En cours',
  },
  [CompetitionStatus.UPCOMING]: {
    variant: BADGE_VARIANT.INFO,
    icon: ICONS.UPCOMING,
    isPulse: false,
    ariaLabel: 'Compétition à venir',
    label: 'À venir',
  },
  [CompetitionStatus.FINISHED]: {
    variant: BADGE_VARIANT.DANGER,
    icon: ICONS.FINISHED,
    isPulse: false,
    ariaLabel: 'Compétition terminée',
    label: 'Terminé',
  },
} as const;

export const StatusBadge = ({ status }: { status: CompetitionStatusType }) => {
  const config = STATUS_CONFIG[status];

  if (!config) return null;

  return (
    <Badge
      role="status"
      variant={config.variant}
      isPulse={config.isPulse}
      aria-label={config.ariaLabel}
      icon={config.icon}
      hideTextMobile={true}
    >
      {config.label}
    </Badge>
  );
};
