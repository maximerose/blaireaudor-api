import React from 'react';
import { Text, TEXT_VARIANT } from './Text';
import { cn } from '@/shared/utils';

export const SECTION_HEADER_VARIANT = {
  TITLE: 'title', // Gros (H1 visuel) - Dashboard, Page Titre, Auth
  BLOCK: 'block', // Moyen (H2 visuel) - Modales, Gros blocs
  SUB: 'sub', // Petit (H3 visuel) - Sections Admin, Paramètres
  DIVIDER: 'divider', // Séparateur horizontal
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
}

export const SectionHeader = ({
  title,
  subtitle,
  icon,
  variant = SECTION_HEADER_VARIANT.SUB,
  colorTheme = SECTION_HEADER_THEME.DEFAULT,
  centered = false,
  className,
  id,
  as,
  rightElement,
}: SectionHeaderProps) => {
  // --- 1. Variante DIVIDER ---
  if (variant === SECTION_HEADER_VARIANT.DIVIDER) {
    return (
      <header className={cn('flex items-center gap-4 px-1', className)}>
        <Text
          variant={TEXT_VARIANT.CAPTION}
          className={cn(
            'whitespace-nowrap font-bold uppercase tracking-widest',
            colorTheme === SECTION_HEADER_THEME.DANGER
              ? 'text-danger-bright'
              : colorTheme === SECTION_HEADER_THEME.GOLD
                ? 'text-gold opacity-60'
                : colorTheme === SECTION_HEADER_THEME.DIMMED
                  ? 'text-white opacity-20'
                  : 'text-white opacity-40',
          )}
        >
          {title}
        </Text>
        <div
          className={cn(
            'h-px flex-1 ml-4',
            colorTheme === SECTION_HEADER_THEME.GOLD
              ? 'bg-gold/10'
              : colorTheme === SECTION_HEADER_THEME.DIMMED
                ? 'bg-white/2'
                : 'bg-white/5',
          )}
        />
        {rightElement && <div className="shrink-0">{rightElement}</div>}
      </header>
    );
  }

  // --- 2. Variantes Textuelles (TITLE, BLOCK, SUB) ---
  const isTitle = variant === SECTION_HEADER_VARIANT.TITLE;
  const isBlock = variant === SECTION_HEADER_VARIANT.BLOCK;
  const isSub = variant === SECTION_HEADER_VARIANT.SUB;

  const defaultTag = isTitle ? 'h1' : isBlock ? 'h2' : 'h3';
  const TitleTag = as || defaultTag;

  const titleVariant = isTitle
    ? TEXT_VARIANT.H1
    : isBlock
      ? TEXT_VARIANT.H2
      : TEXT_VARIANT.H3;

  return (
    <header
      className={cn(
        'flex flex-col',
        centered ? 'items-center text-center' : 'items-start text-left',
        !isSub ? 'space-y-2 mb-4' : 'gap-1',
        className,
      )}
    >
      {icon && (
        <div
          className={cn('flex items-center justify-center', !isSub && 'mb-2')}
        >
          {icon}
        </div>
      )}

      <Text
        id={id}
        as={TitleTag}
        variant={titleVariant}
        className={cn(
          isBlock && 'text-gold italic flex items-center justify-center gap-2',
          colorTheme === SECTION_HEADER_THEME.DANGER && 'text-danger',
        )}
      >
        {title}
      </Text>

      {subtitle && (
        <Text
          variant={isSub ? TEXT_VARIANT.MICRO : TEXT_VARIANT.CAPTION}
          className={isSub ? 'opacity-50' : 'text-white/60'}
        >
          {subtitle}
        </Text>
      )}
    </header>
  );
};
