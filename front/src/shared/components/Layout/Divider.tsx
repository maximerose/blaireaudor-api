import React from 'react';
import { cn } from '@/shared/utils';
import { LAYOUT, type LayoutMy } from '@/shared/constants';

interface DividerProps extends React.HTMLAttributes<
  HTMLHRElement | HTMLDivElement
> {
  spacing?: LayoutMy;
  orientation?: 'horizontal' | 'vertical';
}

export const Divider = ({
  spacing = 'md',
  orientation = 'horizontal',
  className,
  ...props
}: DividerProps) => {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('w-px bg-border-base mx-1 shrink-0', className)}
        {...props}
      />
    );
  }

  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      className={cn(
        'w-full border-t border-border-base',
        LAYOUT.MY[spacing],
        className,
      )}
      {...props}
    />
  );
};
