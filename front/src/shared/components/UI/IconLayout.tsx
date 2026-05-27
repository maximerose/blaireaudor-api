import type React from 'react';

interface IconLayoutProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  reverse?: boolean;
}

export const IconLayout = ({
  icon,
  children,
  reverse = false,
}: IconLayoutProps) => {
  return (
    <span className="inline-flex items-center gap-2">
      {reverse ? children : icon}
      {reverse ? icon : children}
    </span>
  );
};

// <IconLayout icon={ICONS.DANGER}>Attention</IconLayout>
// <IconLayout icon={ICONS.CHECK} reverse>Valider</IconLayout>
