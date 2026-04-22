import React from 'react';
import { Card } from './Card';
import { Text } from './Typography';
import { cn } from '../../utils/cn';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string | React.ReactNode;
  title: string;
  message?: string;
  action?: React.ReactNode;
  /** * 'card' : pour l'intérieur des tableaux (ex: ActionTable)
   * 'dashed' : pour les grandes zones (ex: Dashboard)
   */
  layout?: 'card' | 'dashed';
}

export const EmptyState = ({
  icon = '💨',
  title,
  message,
  action,
  layout = 'card',
  className = '',
  ...props
}: EmptyStateProps) => {
  const content = (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 animate-fade-in">
      <div className="text-3xl sm:text-4xl opacity-30 mb-4 animate-bounce-subtle select-none">
        {icon}
      </div>

      <Text variant="caption" className="text-white/40">
        {title}
      </Text>

      {message && (
        <Text
          variant="body"
          className="text-white/20 text-[10px] sm:text-xs italic mt-2 leading-tight"
        >
          {message}
        </Text>
      )}

      {action && (
        <div className="mt-6 w-full max-w-xs animate-slide-up">{action}</div>
      )}
    </div>
  );

  if (layout === 'dashed') {
    return (
      <div
        className={`border-2 border-dashed border-white/5 rounded-[2.5rem] bg-dark-lighter/20 ${className}`}
        {...props}
      >
        {content}
      </div>
    );
  }

  return (
    <Card
      variant="dark"
      className={cn(
        'border-dashed border-white/5 bg-transparent shadow-none',
        className,
      )}
      {...props}
    >
      {content}
    </Card>
  );
};
