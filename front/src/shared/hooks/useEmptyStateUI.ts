import { cn } from '@/shared/utils';
import { Card } from '@/shared/components/UI';
import type React from 'react';

const DASHED_LAYOUT =
  'border-2 border-dashed border-white/5 rounded-[2.5rem] bg-dark-lighter/20';
const CARD_LAYOUT = 'border-dashed border-white/5 bg-transparent shadow-none';

export const useEmptyStateUI = (
  layout: 'card' | 'dashed',
  className: string,
) => {
  const isDashed = layout === 'dashed';

  const Wrapper = (isDashed ? 'div' : Card) as React.ElementType;

  const wrapperProps = isDashed
    ? { className: cn(DASHED_LAYOUT, className) }
    : { variant: 'dark' as const, className: cn(CARD_LAYOUT, className) };

  return {
    Wrapper,
    wrapperProps,
  };
};
