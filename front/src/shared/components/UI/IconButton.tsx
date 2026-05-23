import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils';
import { BUTTON_SIZE, type ButtonSize } from './Button';

export const ICON_BUTTON_VARIANT = {
  DEFAULT: 'default',
  GHOST: 'ghost',
  DANGER: 'danger',
} as const;

export type IconButtonVariant =
  (typeof ICON_BUTTON_VARIANT)[keyof typeof ICON_BUTTON_VARIANT];

interface BaseIconButtonProps {
  icon: React.ReactNode | string;
  variant?: IconButtonVariant;
  size?: ButtonSize;
  to?: string;
  className?: string;
}

export type IconButtonProps = BaseIconButtonProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof BaseIconButtonProps
  > &
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof BaseIconButtonProps
  >;

const VARIANT_STYLES: Record<IconButtonVariant, string> = {
  [ICON_BUTTON_VARIANT.DEFAULT]:
    'bg-surface-raised border border-border-base text-white hover:bg-surface-hover hover:border-gold-border focus:ring-gold-border',
  [ICON_BUTTON_VARIANT.GHOST]:
    'bg-transparent text-white/60 hover:text-white hover:bg-surface-hover focus:ring-border-base',
  [ICON_BUTTON_VARIANT.DANGER]:
    'bg-danger/20 border border-danger-border text-danger-bright hover:bg-danger/30 focus:ring-danger-border',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  [BUTTON_SIZE.SMALL]: 'p-1.5 text-xs',
  [BUTTON_SIZE.MEDIUM]: 'p-2.5 text-sm',
  [BUTTON_SIZE.LARGE]: 'p-3.5 text-base',
};

export const IconButton = ({
  icon,
  variant = ICON_BUTTON_VARIANT.GHOST,
  size = BUTTON_SIZE.MEDIUM,
  to,
  className,
  disabled,
  ...props
}: IconButtonProps) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center aspect-square rounded-full transition-default cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed',
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    className,
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={baseClasses} {...(props as any)}>
        {icon}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={baseClasses}
      disabled={disabled}
      {...props}
    >
      {icon}
    </button>
  );
};
