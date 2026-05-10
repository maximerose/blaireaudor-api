import React from 'react';
import { cn } from '@/utils';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'caption'
  | 'micro'
  | 'mono';

const TEXT_STYLES: Record<TextVariant, string> = {
  h1: 'text-2xl sm:text-3xl font-black uppercase tracking-tight italic text-gold',
  h2: 'text-lg sm:text-xl font-bold uppercase tracking-tight text-white',
  h3: 'text-sm sm:text-base font-bold text-gold/80 leading-tight',
  body: 'text-sm text-white/90 leading-relaxed',
  caption:
    'text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-80',
  micro:
    'text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.3em] opacity-60',
  mono: 'font-mono uppercase tracking-widest text-sm',
};

const DEFAULT_TAGS: Record<TextVariant, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  caption: 'span',
  micro: 'span',
  mono: 'span',
};

export const useTextUI = (
  variant: TextVariant,
  as?: React.ElementType,
  className?: string,
) => {
  const Component = as || DEFAULT_TAGS[variant];
  const combinedClasses = cn(
    TEXT_STYLES[variant],
    'wrap-break-word',
    className,
  );

  return { Component, combinedClasses };
};
