// front/src/shared/components/UI/Text.tsx

import type React from 'react';
import { cn } from '@/shared/utils';

export const TEXT_VARIANT = {
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  BODY: 'body',
  CAPTION: 'caption',
  MICRO: 'micro',
  MONO: 'mono',
} as const;

export const TEXT_THEME = {
  DEFAULT: 'default',
  MUTED: 'muted', // 🟢 Remplace opacity-60/80 (Gris clair)
  DIMMED: 'dimmed', // 🟢 Remplace opacity-20/40 (Gris foncé/Discret)
  GOLD: 'gold', // Pour les titres et accents
  DANGER: 'danger',
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  INHERIT: 'inherit', // 🟢 Crucial pour les Alertes ou Boutons
} as const;

export type TextVariant = (typeof TEXT_VARIANT)[keyof typeof TEXT_VARIANT];
export type TextTheme = (typeof TEXT_THEME)[keyof typeof TEXT_THEME];

// 🟢 On ne garde QUE les propriétés de fonte (taille, graisse, espacement)
export const TEXT_STYLES: Record<TextVariant, string> = {
  [TEXT_VARIANT.H1]:
    'text-xl sm:text-2xl font-black uppercase tracking-tight italic',
  [TEXT_VARIANT.H2]: 'text-lg sm:text-xl font-bold uppercase tracking-tight',
  [TEXT_VARIANT.H3]: 'text-sm sm:text-base font-bold leading-tight',
  [TEXT_VARIANT.BODY]: 'text-sm leading-relaxed',
  [TEXT_VARIANT.CAPTION]:
    'text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]',
  [TEXT_VARIANT.MICRO]:
    'text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.3em]',
  [TEXT_VARIANT.MONO]: 'font-mono uppercase tracking-widest text-sm',
} as const;

// 🟢 On mappe explicitement nos tokens sémantiques Tailwind
const THEME_STYLES: Record<TextTheme, string> = {
  [TEXT_THEME.DEFAULT]: 'text-silver',
  [TEXT_THEME.MUTED]: 'text-text-muted',
  [TEXT_THEME.DIMMED]: 'text-text-dimmed',
  [TEXT_THEME.GOLD]: 'text-gold',
  [TEXT_THEME.DANGER]: 'text-danger-bright',
  [TEXT_THEME.SUCCESS]: 'text-success-bright',
  [TEXT_THEME.INFO]: 'text-info-bright',
  [TEXT_THEME.WARNING]: 'text-warning-bright',
  [TEXT_THEME.INHERIT]: 'text-inherit',
};

const DEFAULT_TAGS: Record<TextVariant, React.ElementType> = {
  [TEXT_VARIANT.H1]: 'h1',
  [TEXT_VARIANT.H2]: 'h2',
  [TEXT_VARIANT.H3]: 'h3',
  [TEXT_VARIANT.BODY]: 'p',
  [TEXT_VARIANT.CAPTION]: 'span',
  [TEXT_VARIANT.MICRO]: 'span',
  [TEXT_VARIANT.MONO]: 'span',
};

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  colorTheme?: TextTheme; // 🟢 Nouvelle prop
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  htmlFor?: string;
  href?: string;
  target?: string;
}

export const Text = ({
  variant = TEXT_VARIANT.BODY,
  colorTheme = TEXT_THEME.DEFAULT,
  children,
  className = '',
  as,
  ...props
}: TextProps) => {
  const Tag = as || DEFAULT_TAGS[variant];
  const combinedClasses = cn(
    TEXT_STYLES[variant],
    THEME_STYLES[colorTheme],
    'wrap-break-word',
    className,
  );

  return (
    <Tag className={combinedClasses} {...props}>
      {children}
    </Tag>
  );
};
