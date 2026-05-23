import { Badge, BADGE_VARIANT, ICONS } from '@/shared';

interface RoleBadgeProps {
  role: 'creator' | 'referee' | 'guest';
}

const ROLE_CONFIG = {
  creator: {
    variant: BADGE_VARIANT.CREATOR,
    label: 'Créateur',
    icon: ICONS.CREATOR,
    className: '',
  },
  referee: {
    variant: BADGE_VARIANT.REFEREE,
    label: 'Arbitre',
    icon: ICONS.REFEREE,
    className: '',
  },
  guest: {
    variant: BADGE_VARIANT.GHOST,
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
