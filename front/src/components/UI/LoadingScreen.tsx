import type React from 'react';
import { Text } from './Typography';
import { cn } from '../../utils/cn';

interface LoadingScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export const LoadingScreen = ({
  message = 'Chargement...',
  className = '',
  ...props
}: LoadingScreenProps) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-dark animate-fade-in',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
      {...props}
    >
      <div className="flex flex-col items-center gap-8">
        <div
          className="relative flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="w-16 h-16 border-2 border-gold/5 rounded-full" />
          <div className="absolute w-16 h-16 border-2 border-transparent border-t-gold rounded-full animate-spin motion-reduce:animate-none" />
          <div className="absolute w-1 h-1 bg-gold/20 rounded-full" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <Text
            variant="caption"
            className="animate-pulse motion-reduce:animate-none italic text-gold tracking-[0.4em] text-center px-6"
          >
            {message}
          </Text>

          <div
            className="w-12 h-px bg-gold/10 relative overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gold/40 animate-[loading-bar_1.5s_infinite_ease-in-out] motion-reduce:hidden" />
          </div>
        </div>
      </div>

      <span className="sr-only">
        Veuillez patienter, le contenu de l'arène est en cours de chargement.
      </span>
    </div>
  );
};
