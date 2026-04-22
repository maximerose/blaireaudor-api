import React from 'react';
import { cn } from '../../utils/cn';

export type TextVariant =
  | 'h1' // Très gros titres (Dashboard, Detail)
  | 'h2' // Titres de section
  | 'h3' // Titres de cartes
  | 'body' // Texte de base
  | 'caption' // Petits labels (souvent opacity-60, text-[9px])
  | 'micro' // Très petits labels (souvent opacity-40, text-[7px])
  | 'mono'; // Codes de tournoi, scores

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  htmlFor?: string;
  href?: string;
  target?: string;
}

const styles: Record<TextVariant, string> = {
  h1: 'text-2xl sm:text-3xl font-black uppercase tracking-tighter italic text-gold',
  h2: 'text-lg sm:text-xl font-bold uppercase tracking-tight text-white',
  h3: 'text-sm sm:text-base font-bold text-gold/80 leading-tight',
  body: 'text-sm text-white/80 leading-relaxed',
  caption:
    'text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-60',
  micro:
    'text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.3em] opacity-40',
  mono: 'font-mono uppercase tracking-widest text-sm',
};

const defaultTags: Record<TextVariant, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  caption: 'span',
  micro: 'span',
  mono: 'span',
};

export const Text = ({
  variant = 'body',
  children,
  className = '',
  as,
  ...props
}: TextProps) => {
  const Component = as || defaultTags[variant];
  return (
    <Component className={cn(styles[variant], className)} {...props}>
      {children}
    </Component>
  );
};
