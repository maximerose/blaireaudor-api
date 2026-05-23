import type React from 'react';
import { Text, TEXT_VARIANT, TEXT_THEME, type TextTheme } from './Text';
import { cn } from '@/shared/utils';
import { Stack } from '../Layout/Stack';
import { Row } from '../Layout/Row';
import { Badge, BADGE_VARIANT } from './Badge';

export const SECTION_HEADER_VARIANT = {
  TITLE: 'title',
  BLOCK: 'block',
  SUB: 'sub',
  DIVIDER: 'divider',
} as const;

export const SECTION_HEADER_THEME = {
  DEFAULT: 'default',
  GOLD: 'gold',
  DIMMED: 'dimmed',
  DANGER: 'danger',
} as const;

export type SectionHeaderVariant =
  (typeof SECTION_HEADER_VARIANT)[keyof typeof SECTION_HEADER_VARIANT];
export type SectionHeaderTheme =
  (typeof SECTION_HEADER_THEME)[keyof typeof SECTION_HEADER_THEME];

export interface SectionHeaderProps {
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  icon?: React.ReactNode;
  variant?: SectionHeaderVariant;
  centered?: boolean;
  className?: string;
  colorTheme?: SectionHeaderTheme;
  id?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
  rightElement?: React.ReactNode;
  badge?: string | number;
}

const HEADER_TO_TEXT_THEME: Record<SectionHeaderTheme, TextTheme> = {
  [SECTION_HEADER_THEME.DEFAULT]: TEXT_THEME.DEFAULT,
  [SECTION_HEADER_THEME.GOLD]: TEXT_THEME.GOLD,
  [SECTION_HEADER_THEME.DIMMED]: TEXT_THEME.DIMMED,
  [SECTION_HEADER_THEME.DANGER]: TEXT_THEME.DANGER,
};

export const SectionHeader = ({
  title,
  subtitle,
  icon,
  variant = SECTION_HEADER_VARIANT.SUB,
  colorTheme,
  centered = false,
  className,
  id,
  as,
  rightElement,
  badge,
}: SectionHeaderProps) => {
  const isTitle = variant === SECTION_HEADER_VARIANT.TITLE;
  const isBlock = variant === SECTION_HEADER_VARIANT.BLOCK;
  const isSub = variant === SECTION_HEADER_VARIANT.SUB;
  const isDivider = variant === SECTION_HEADER_VARIANT.DIVIDER;

  const resolvedTheme =
    colorTheme && colorTheme !== SECTION_HEADER_THEME.DEFAULT
      ? HEADER_TO_TEXT_THEME[colorTheme]
      : isDivider
        ? TEXT_THEME.MUTED
        : TEXT_THEME.GOLD;

  if (isDivider) {
    const renderRightElement =
      rightElement ||
      (badge !== undefined && (
        <Badge
          variant={BADGE_VARIANT.GHOST}
          className="uppercase tracking-wider opacity-60"
        >
          {badge}
        </Badge>
      ));
    return (
      <Row align="center" gap="md" px="xs" className={className}>
        <Row
          align="center"
          gap="xs"
          fullWidth={false}
          className="whitespace-nowrap shrink-0"
        >
          {icon && (
            <div
              className={cn(
                resolvedTheme === TEXT_THEME.GOLD
                  ? 'text-gold'
                  : resolvedTheme === TEXT_THEME.DANGER
                    ? 'text-danger-bright'
                    : 'text-text-muted',
              )}
            >
              {icon}
            </div>
          )}
          <Text variant={TEXT_VARIANT.CAPTION} colorTheme={resolvedTheme}>
            {title}
          </Text>
        </Row>
        <div
          className={cn(
            'h-px flex-1',
            resolvedTheme === TEXT_THEME.GOLD
              ? 'bg-gold-soft'
              : resolvedTheme === TEXT_THEME.DIMMED
                ? 'bg-surface-base'
                : 'bg-border-subtle',
          )}
        />
        {renderRightElement && (
          <div className="shrink-0">{renderRightElement}</div>
        )}
      </Row>
    );
  }

  const defaultTag = isTitle ? 'h1' : isBlock ? 'h2' : 'h3';
  const TitleTag = as || defaultTag;
  const titleVariant = isTitle
    ? TEXT_VARIANT.H1
    : isBlock
      ? TEXT_VARIANT.H2
      : TEXT_VARIANT.H3;

  return (
    <Stack
      align={centered ? 'center' : 'start'}
      gap={isSub ? 'xs' : 'sm'}
      className={cn(centered ? 'text-center' : 'text-left', className)}
    >
      {icon && <div className="flex items-center justify-center">{icon}</div>}

      <Text
        id={id}
        as={TitleTag}
        variant={titleVariant}
        colorTheme={resolvedTheme}
        className={cn(
          isBlock && 'italic flex items-center justify-center gap-2',
        )}
      >
        {title}
      </Text>

      {subtitle && (
        <Text
          variant={isSub ? TEXT_VARIANT.MICRO : TEXT_VARIANT.CAPTION}
          colorTheme={
            resolvedTheme === TEXT_THEME.DIMMED
              ? TEXT_THEME.DIMMED
              : isSub
                ? TEXT_THEME.DIMMED
                : TEXT_THEME.MUTED
          }
        >
          {subtitle}
        </Text>
      )}
    </Stack>
  );
};
