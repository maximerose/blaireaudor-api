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
      {...props}
    >
      <div className="flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-2 border-gold/5 rounded-full" />
          <div className="absolute w-16 h-16 border-2 border-transparent border-t-gold rounded-full animate-spin" />
          <div className="absolute w-1 h-1 bg-gold/20 rounded-full" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <Text
            variant="caption"
            className="animate-pulse italic text-gold tracking-[0.4em] text-center px-6"
          >
            {message}
          </Text>

          <div className="w-12 h-px bg-gold/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gold/40 animate-[loading-bar_1.5s_infinite_ease-in-out]" />
          </div>
        </div>
      </div>
    </div>
  );
};
