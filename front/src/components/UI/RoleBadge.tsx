import { Badge } from '@/components/UI';

interface RoleBadgeProps {
  role: 'creator' | 'referee';
}

const ROLE_CONFIG = {
  creator: {
    variant: 'warning' as const,
    label: 'Créateur',
    icon: '👑',
  },
  referee: {
    variant: 'info' as const,
    label: 'Arbitre',
    icon: '⚖️',
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
