import { Badge } from '@/components/UI';
import { ICONS } from '@/constants';

interface RoleBadgeProps {
  role: 'creator' | 'referee';
}

const ROLE_CONFIG = {
  creator: {
    variant: 'success' as const,
    label: 'Créateur',
    icon: ICONS.CREATOR,
  },
  referee: {
    variant: 'info' as const,
    label: 'Arbitre',
    icon: ICONS.REFEREE,
  },
};

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  const config = ROLE_CONFIG[role];

  return (
    <Badge variant={config.variant} icon={config.icon}>
      {config.label}
    </Badge>
  );
};
