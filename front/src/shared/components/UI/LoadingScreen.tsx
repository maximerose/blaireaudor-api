import type React from 'react';
import { Text, TEXT_VARIANT, TEXT_THEME } from './Text';
import { cn } from '@/shared/utils';
import { UI } from '@/shared/constants';
import { Stack } from '../Layout/Stack';
import { BadgerLogo } from '@/shared/logo';

interface LoadingScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  layout?: 'fullscreen' | 'local';
}

const SPINNER_BASE = 'relative flex items-center justify-center';
const BAR_CONTAINER = 'w-12 h-px bg-gold-soft relative overflow-hidden';
const BAR_ANIMATION =
  'absolute inset-0 bg-gold opacity-40 animate-[loading-bar_1.5s_infinite_ease-in-out] motion-reduce:hidden';

export const LoadingScreen = ({
  message = UI.LOADING_DEFAULT,
  layout = 'fullscreen',
  className = '',
  ...props
}: LoadingScreenProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center transition-default animate-fade-in',
        layout === 'fullscreen'
          ? 'fixed inset-0 z-50 bg-dark'
          : 'relative w-full min-h-75 bg-transparent',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
      {...props}
    >
      <Stack align="center" gap="xl">
        <BadgerLogo className="w-40 h-40 md:w-60 md:h-60" />
        <div className={SPINNER_BASE} aria-hidden="true">
          <div className="w-16 h-16 border-2 border-gold-soft rounded-full" />
          <div className="absolute w-16 h-16 border-2 border-transparent border-t-gold rounded-full animate-spin motion-reduce:animate-none" />
          <div className="absolute w-1 h-1 bg-gold-border rounded-full" />
        </div>

        <Stack align="center" gap="sm" px="lg">
          <Text
            variant={TEXT_VARIANT.CAPTION}
            colorTheme={TEXT_THEME.GOLD}
            className="animate-pulse motion-reduce:animate-none italic tracking-[0.4em] text-center"
          >
            {message}
          </Text>

          <div className={BAR_CONTAINER} aria-hidden="true">
            <div className={BAR_ANIMATION} />
          </div>
        </Stack>
      </Stack>

      <span className="sr-only">{UI.LOADING_SR}</span>
    </div>
  );
};
