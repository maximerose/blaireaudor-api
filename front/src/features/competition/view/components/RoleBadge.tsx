import { Badge, ICONS } from '@/shared';

interface RoleBadgeProps {
  role: 'creator' | 'referee' | 'guest';
}

const ROLE_CONFIG = {
  creator: {
    variant: 'creator' as const,
    label: 'Créateur',
    icon: ICONS.CREATOR,
    className: '',
  },
  referee: {
    variant: 'referee' as const,
    label: 'Arbitre',
    icon: ICONS.REFEREE,
    className: '',
  },
  guest: {
    variant: 'guest' as const,
    label: 'Invité',
    icon: undefined,
    className: 'opacity-60 text-[8px] py-0 px-1.5',
  },
};

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  const config = ROLE_CONFIG[role];

  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      className={config.className}
    >
      {config.label}
    </Badge>
  );
};
