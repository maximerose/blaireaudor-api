import { UI } from '@/shared/constants';
import { BadgerLogo } from '@/shared/logo';
import { cn } from '@/shared/utils';
import type React from 'react';
import { Stack } from '../Layout/Stack';
import { Text, TEXT_THEME, TEXT_VARIANT } from './Text';

interface LoadingScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  layout?: 'fullscreen' | 'local';
}

const BAR_CONTAINER = 'w-12 h-px bg-gold-soft relative overflow-hidden mx-auto';
const BAR_ANIMATION =
  'absolute inset-0 bg-gold opacity-40 animate-[loading-bar_1.5s_infinite_ease-in-out] motion-reduce:hidden';

export const LoadingScreen = ({
  message = UI.LOADING_DEFAULT,
  layout = 'fullscreen',
  className = '',
  ...props
}: LoadingScreenProps) => {
  const isFullscreen = layout === 'fullscreen';
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
        {isFullscreen && (
          <BadgerLogo className="w-60 h-60 md:w-80 md:h-80 animate-pulse drop-shadow-[0_0_30px_rgba(255,184,0,0.5)]" />
        )}
        <Stack align="center" gap="sm" px="lg" className="mx-3">
          <Text
            variant={isFullscreen ? TEXT_VARIANT.CAPTION : TEXT_VARIANT.MICRO}
            colorTheme={TEXT_THEME.GOLD}
            className="animate-pulse motion-reduce:animate-none italic tracking-[0.4em] pl-[0.4em] text-center"
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
