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
    <Badge variant={config.variant}>
      <span className="flex items-center gap-1">
        <span>{config.icon}</span>
        <span className="uppercase tracking-tighter font-bold">
          {config.label}
        </span>
      </span>
    </Badge>
  );
};
