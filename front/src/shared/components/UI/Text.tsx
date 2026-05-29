import { cn } from '@/shared/utils';
import type React from 'react';

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
  MUTED: 'muted',
  DIMMED: 'dimmed',
  GOLD: 'gold',
  DANGER: 'danger',
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  INHERIT: 'inherit',
} as const;

export type TextVariant = (typeof TEXT_VARIANT)[keyof typeof TEXT_VARIANT];
export type TextTheme = (typeof TEXT_THEME)[keyof typeof TEXT_THEME];

export const TEXT_STYLES: Record<TextVariant, string> = {
  [TEXT_VARIANT.H1]:
    'text-2xl sm:text-3xl font-black uppercase tracking-tight italic',
  [TEXT_VARIANT.H2]: 'text-xl sm:text-2xl font-bold uppercase tracking-tight',
  [TEXT_VARIANT.H3]: 'text-lg font-bold leading-tight',
  [TEXT_VARIANT.BODY]: 'text-base leading-relaxed',
  [TEXT_VARIANT.CAPTION]: 'text-sm font-black uppercase tracking-wider',
  [TEXT_VARIANT.MICRO]: 'text-xs font-bold uppercase tracking-wider',
  [TEXT_VARIANT.MONO]:
    'text-sm sm:text-base font-mono uppercase tracking-wider',
} as const;

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
  colorTheme?: TextTheme;
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
