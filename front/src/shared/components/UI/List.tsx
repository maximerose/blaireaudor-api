import React from 'react';
import { cn } from '@/shared/utils';

export interface ListProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export const List = ({
  as: Tag = 'div',
  className,
  children,
  ...props
}: ListProps) => {
  return (
    <Tag
      className={cn(
        'w-full divide-y divide-border-subtle overflow-hidden',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};

export interface ListItemProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  isHoverable?: boolean;
  isActive?: boolean;
}

export const ListItem = ({
  as: Tag = 'div',
  isHoverable = false,
  isActive = false,
  className,
  children,
  ...props
}: ListItemProps) => {
  return (
    <Tag
      className={cn(
        'w-full flex items-center justify-between p-4 transition-default',
        isHoverable &&
          'hover:bg-surface-base cursor-pointer focus:outline-none focus:bg-surface-base',
        isActive && 'bg-gold-soft border-l-2 border-gold',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};
