// front/src/shared/components/UI/Card.tsx

import React from 'react';
import { cn } from '@/shared/utils';
import { LAYOUT, type LayoutP } from '@/shared/constants';
import { Row, Stack } from '../Layout';

export const CARD_VARIANT = {
  DEFAULT: 'default',
  DARK: 'dark',
  GLASS: 'glass',
} as const;

export type CardVariant = (typeof CARD_VARIANT)[keyof typeof CARD_VARIANT];
export type CardRadius = 'none' | 'md' | 'lg' | 'xl' | '2xl' | 'card';

export interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  isHoverable?: boolean;
  variant?: CardVariant;
  padding?: LayoutP;
  radius?: CardRadius;
}

export type CardProps<T extends React.ElementType = 'div'> = BaseCardProps & {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof BaseCardProps | 'as'>;

const CARD_STYLES: Record<CardVariant, string> = {
  [CARD_VARIANT.DEFAULT]: 'bg-surface-sunken border-gold-soft',
  [CARD_VARIANT.DARK]: 'bg-surface-sunken border-border-subtle',
  [CARD_VARIANT.GLASS]: 'bg-surface-base border-border-base backdrop-blur-md',
};

const RADIUS_STYLES: Record<CardRadius, string> = {
  none: 'rounded-none',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  card: 'rounded-card',
};

const BASE_STYLES = 'border shadow-xl transition-default overflow-hidden';

export const CardRoot = <T extends React.ElementType = 'div'>({
  as,
  children,
  className,
  isHoverable = false,
  variant = CARD_VARIANT.DEFAULT,
  padding,
  radius = 'xl',
  onClick,
  ...props
}: CardProps<T>) => {
  const Tag = as || 'div';
  const isClickable = !!onClick;

  const hoverStyles =
    isHoverable || isClickable
      ? 'hover:border-gold-border hover:bg-surface-hover hover:shadow-lg hover:shadow-gold-soft cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold-border'
      : '';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      (onClick as (e: React.SyntheticEvent<HTMLElement>) => void)?.(e);
    }
  };

  return (
    <Tag
      onClick={onClick}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={cn(
        BASE_STYLES,
        CARD_STYLES[variant],
        RADIUS_STYLES[radius],
        hoverStyles,
        padding && LAYOUT.P[padding],
        className,
      )}
      {...(props as any)}
    >
      {children}
    </Tag>
  );
};

// --- SOUS COMPOSANTS DU COMPOUND PATTERN ---

const CardHeader = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Row>) => (
  <Row
    justify="between"
    align="center"
    p="md"
    className={cn('border-b border-border-subtle bg-black/5', className)}
    {...props}
  >
    {children}
  </Row>
);

const CardBody = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Stack>) => (
  <Stack gap="md" p="md" className={className} {...props}>
    {children}
  </Stack>
);

const CardFooter = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Row>) => (
  <Row
    justify="between"
    align="center"
    p="md"
    className={cn('border-t border-border-subtle bg-black/5', className)}
    {...props}
  >
    {children}
  </Row>
);

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
