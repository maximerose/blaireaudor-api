import { useId } from 'react';
import { cn } from '@/utils';

interface InputStylesProps {
  align: 'left' | 'center';
  icon?: any;
  className: string;
}

export const useInputUI = (
  id: string | undefined,
  { align, icon, className }: InputStylesProps,
) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  const labelClasses = cn(
    'block text-gold ml-1 cursor-pointer font-bold uppercase tracking-wider',
    align === 'center' ? 'text-center' : 'text-left',
  );

  const inputClasses = cn(
    'w-full bg-black/20 border border-gold/10 text-gold rounded-xl',
    'py-2 sm:py-2.5 pr-2 sm:pr-4',
    'placeholder:text-gold/20 text-[11px] sm:text-sm transition-default truncate text-ellipsis overflow-hidden',
    'focus:outline-none focus:border-gold/40 focus:ring-4 focus:ring-gold/5',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    align === 'center' ? 'text-center' : 'text-left',
    align === 'center' && icon ? 'pr-10' : 'pr-4',
    className,
  );

  return { inputId, labelClasses, inputClasses };
};
