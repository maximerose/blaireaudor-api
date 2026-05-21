import type React from 'react';
import { Text, TEXT_VARIANT } from './Text';
import { cn } from '@/shared/utils';

interface LoadingScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  layout?: 'fullscreen' | 'local';
}

const SPINNER_BASE = 'relative flex items-center justify-center';
const BAR_CONTAINER = 'w-12 h-px bg-gold/10 relative overflow-hidden';
const BAR_ANIMATION =
  'absolute inset-0 bg-gold/40 animate-[loading-bar_1.5s_infinite_ease-in-out] motion-reduce:hidden';

export const LoadingScreen = ({
  message = 'Chargement...',
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
      <div className="flex flex-col items-center gap-8">
        <div className={SPINNER_BASE} aria-hidden="true">
          <div className="w-16 h-16 border-2 border-gold/5 rounded-full" />
          <div className="absolute w-16 h-16 border-2 border-transparent border-t-gold rounded-full animate-spin motion-reduce:animate-none" />
          <div className="absolute w-1 h-1 bg-gold/20 rounded-full" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <Text
            variant={TEXT_VARIANT.CAPTION}
            className="animate-pulse motion-reduce:animate-none italic text-gold tracking-[0.4em] text-center px-6"
          >
            {message}
          </Text>

          <div className={BAR_CONTAINER} aria-hidden="true">
            <div className={BAR_ANIMATION} />
          </div>
        </div>
      </div>

      <span className="sr-only">
        Veuillez patienter, le contenu de l'arène est en cours de chargement.
      </span>
    </div>
  );
};
