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

export type TextVariant = (typeof TEXT_VARIANT)[keyof typeof TEXT_VARIANT];

export const TEXT_STYLES: Record<TextVariant, string> = {
  [TEXT_VARIANT.H1]:
    'text-xl sm:text-2xl font-black uppercase tracking-tight italic text-gold',
  [TEXT_VARIANT.H2]:
    'text-lg sm:text-xl font-bold uppercase tracking-tight text-white',
  [TEXT_VARIANT.H3]:
    'text-sm sm:text-base font-bold text-gold/80 leading-tight',
  [TEXT_VARIANT.BODY]: 'text-sm text-white/90 leading-relaxed',
  [TEXT_VARIANT.CAPTION]:
    'text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-80',
  [TEXT_VARIANT.MICRO]:
    'text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.3em] opacity-60',
  [TEXT_VARIANT.MONO]: 'font-mono uppercase tracking-widest text-sm',
} as const;

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
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  htmlFor?: string;
  href?: string;
  target?: string;
}

export const Text = ({
  variant = TEXT_VARIANT.BODY,
  children,
  className = '',
  as,
  ...props
}: TextProps) => {
  const Tag = as || DEFAULT_TAGS[variant];
  const combinedClasses = cn(
    TEXT_STYLES[variant],
    'wrap-break-word',
    className,
  );

  return (
    <Tag className={combinedClasses} {...props}>
      {children}
    </Tag>
  );
};
