import React from 'react';
import { cn } from '@/shared/utils';
import { Card, CARD_VARIANT, type CardVariant } from './Card';
import {
  SECTION_HEADER_THEME,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  type SectionHeaderVariant,
} from './SectionHeader';
import { Stack } from '../Layout/Stack';

export interface BaseWizardCardProps {
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  headerVariant?: SectionHeaderVariant;
  variant?: CardVariant;
  children: React.ReactNode;
  isAnimated?: boolean;
}

export type WizardCardProps<T extends React.ElementType = 'div'> =
  BaseWizardCardProps & {
    as?: T;
  } & Omit<
      React.ComponentPropsWithoutRef<T>,
      keyof BaseWizardCardProps | 'as' | 'className'
    >;

export const WizardCard = <T extends React.ElementType = 'div'>({
  as,
  title,
  subtitle,
  headerVariant = SECTION_HEADER_VARIANT.TITLE,
  variant = CARD_VARIANT.GLASS,
  isAnimated = true,
  children,
  ...props
}: WizardCardProps<T>) => {
  return (
    <Card
      as={as}
      variant={variant}
      className={cn(
        'relative w-full overflow-visible',
        isAnimated && 'animate-slide-up',
      )}
      {...(props as any)}
    >
      <div
        className="absolute -top-24 -right-24 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Card.Body p="lg" gap="lg" className="relative z-10 w-full">
        {title && (
          <SectionHeader
            colorTheme={SECTION_HEADER_THEME.GOLD}
            id="wizard-card-title"
            variant={headerVariant}
            centered
            title={title}
            subtitle={subtitle}
            className="mb-0"
          />
        )}

        <Stack gap="md" className="w-full">
          {children}
        </Stack>
      </Card.Body>
    </Card>
  );
};

WizardCard.displayName = 'WizardCard';
