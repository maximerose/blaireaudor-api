import { useId, type ReactNode } from 'react';
import { cn } from '@/shared/utils';

interface InputStylesProps {
  align: 'left' | 'center';
  icon?: ReactNode;
  className?: string;
}

export const useInputUI = (
  id: string | undefined,
  { align, icon, className }: InputStylesProps,
) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  const labelClasses = cn(
    'cursor-pointer',
    align === 'center' ? 'text-center' : 'text-left',
  );

  const inputClasses = cn(
    'w-full rounded-xl transition-default truncate text-ellipsis overflow-hidden',
    'bg-surface-sunken border border-gold-soft text-gold',
    'placeholder:text-text-dimmed text-xs sm:text-sm',
    'py-2 sm:py-2.5',
    icon ? 'pl-10 pr-10' : 'px-4',
    'focus:outline-none focus:border-gold focus:shadow-[0_0_10px_rgba(212,175,55,0.15)]',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    align === 'center' ? 'text-center' : 'text-left',
    className,
  );

  return { inputId, labelClasses, inputClasses };
};
