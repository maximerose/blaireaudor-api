import { cn } from '@/shared/utils';
import React from 'react';

export const TEXT_BUTTON_THEME = {
  DEFAULT: 'default',
  GOLD: 'gold',
  SUCCESS: 'success',
  DANGER: 'danger',
} as const;

export type TextButtonTheme =
  (typeof TEXT_BUTTON_THEME)[keyof typeof TEXT_BUTTON_THEME];

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: TextButtonTheme;
  icon?: React.ReactNode | string;
}

const THEME_STYLES: Record<TextButtonTheme, string> = {
  [TEXT_BUTTON_THEME.DEFAULT]:
    'text-white/60 hover:text-white focus:bg-white/5',
  [TEXT_BUTTON_THEME.GOLD]: 'text-gold/80 hover:text-gold focus:bg-gold/5',
  [TEXT_BUTTON_THEME.SUCCESS]:
    'text-success hover:text-success-bright focus:bg-success/5',
  [TEXT_BUTTON_THEME.DANGER]:
    'text-danger hover:text-danger-bright focus:bg-danger/5',
};

export const TextButton = ({
  theme = TEXT_BUTTON_THEME.DEFAULT,
  icon,
  className,
  children,
  ...props
}: TextButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest transition-default hover:underline cursor-pointer focus:outline-none rounded px-1 py-0.5',
        THEME_STYLES[theme],
        className,
      )}
      {...props}
    >
      {children}
      {icon && (
        <span aria-hidden="true" className="leading-none">
          {icon}
        </span>
      )}
    </button>
  );
};
