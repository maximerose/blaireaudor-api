// front/src/shared/components/UI/Button.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils';
import { Row } from '../Layout/Row';
import { Text, TEXT_VARIANT, TEXT_THEME } from './Text';

export const BUTTON_VARIANT = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DANGER: 'danger',
  GHOST: 'ghost',
  GHOST_NEUTRAL: 'ghost-neutral',
} as const;

export const BUTTON_SIZE = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
} as const;

export type ButtonVariant =
  (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT];
export type ButtonSize = (typeof BUTTON_SIZE)[keyof typeof BUTTON_SIZE];

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  to?: string;
}

const BASE_STYLES =
  'inline-flex items-center justify-center transition-default rounded-xl border disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark outline-none shrink-0';

const VARIANTS_STYLES: Record<ButtonVariant, string> = {
  [BUTTON_VARIANT.PRIMARY]:
    'bg-gold border-transparent text-black hover:bg-gold-light hover:shadow-glow-gold shadow-lg shadow-gold/5',
  [BUTTON_VARIANT.SECONDARY]:
    'bg-surface-base border-border-base text-text-muted hover:bg-surface-raised hover:text-silver hover:border-border-subtle',
  [BUTTON_VARIANT.DANGER]:
    'bg-danger-soft border-danger-border text-danger-bright hover:bg-danger hover:text-white transition-slow',
  [BUTTON_VARIANT.GHOST]:
    'text-gold/60 hover:text-gold hover:bg-gold-soft border-transparent',
  [BUTTON_VARIANT.GHOST_NEUTRAL]:
    'text-text-dimmed hover:text-text-muted hover:bg-surface-base border-transparent',
};

const SIZES_STYLES: Record<ButtonSize, string> = {
  [BUTTON_SIZE.SMALL]: 'px-3 py-1.5 min-h-8',
  [BUTTON_SIZE.MEDIUM]: 'px-6 py-2.5 min-h-10',
  [BUTTON_SIZE.LARGE]: 'px-8 py-4 min-h-[3.25rem]',
};

export const Button = ({
  children,
  variant = BUTTON_VARIANT.PRIMARY,
  size = BUTTON_SIZE.MEDIUM,
  isLoading = false,
  fullWidth = false,
  icon,
  className,
  disabled,
  to,
  ...props
}: ButtonProps) => {
  const combinedClasses = cn(
    BASE_STYLES,
    VARIANTS_STYLES[variant],
    SIZES_STYLES[size],
    fullWidth && 'w-full',
    className,
  );

  const textVariant =
    size === BUTTON_SIZE.SMALL
      ? TEXT_VARIANT.MICRO
      : size === BUTTON_SIZE.MEDIUM
        ? TEXT_VARIANT.CAPTION
        : TEXT_VARIANT.BODY;

  const content = (
    <Row justify="center" gap="sm" className="w-full">
      {isLoading && (
        <div
          className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full shrink-0"
          aria-hidden="true"
        />
      )}
      {!isLoading && icon && (
        <span
          className="flex items-center justify-center shrink-0 leading-none"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <Text
        as="span"
        variant={textVariant}
        colorTheme={TEXT_THEME.INHERIT}
        className={cn(
          'leading-none text-center',
          size === BUTTON_SIZE.LARGE && 'font-bold uppercase tracking-widest',
        )} // Forçage du style sur le bouton large si on utilise le variant BODY
      >
        {isLoading && typeof children === 'string' ? 'Chargement...' : children}
      </Text>
    </Row>
  );

  if (to) {
    const isLinkDisabled = disabled || isLoading;
    return (
      <Link
        to={isLinkDisabled ? '#' : to}
        className={cn(combinedClasses, isLinkDisabled && 'pointer-events-none')}
        aria-disabled={isLinkDisabled}
        role="link"
        tabIndex={isLinkDisabled ? -1 : 0}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type || 'button'}
      className={combinedClasses}
      disabled={isLoading || disabled}
      aria-busy={isLoading}
      {...props}
    >
      {content}
    </button>
  );
};
