import React from 'react';
import { Text, TEXT_VARIANT } from './Text';
import { useEmptyStateUI } from '@/shared/hooks';
import { ICONS, UI } from '@/shared/constants';

const ICON_STYLE =
  'text-3xl sm:text-4xl opacity-30 mb-4 animate-bounce-subtle select-none';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string | React.ReactNode;
  title: string;
  message?: string;
  action?: React.ReactNode;
  layout?: 'card' | 'dashed';
}

export const EmptyState = ({
  icon = ICONS.EMPTY,
  title,
  message,
  action,
  layout = 'card',
  className = '',
  ...props
}: EmptyStateProps) => {
  const { Wrapper, wrapperProps } = useEmptyStateUI(layout, className);

  return (
    <Wrapper
      {...wrapperProps}
      {...props}
      role="status"
      aria-label={UI.INFO_ARIA(title)}
    >
      <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 animate-fade-in">
        <div className={ICON_STYLE} aria-hidden="true">
          {icon}
        </div>

        <Text
          variant={TEXT_VARIANT.CAPTION}
          className="text-white/50 font-bold uppercase tracking-widest"
        >
          {title}
        </Text>

        {message && (
          <Text
            variant={TEXT_VARIANT.BODY}
            className="text-white/20 text-[10px] sm:text-xs italic mt-2 leading-tight"
          >
            {message}
          </Text>
        )}

        {action && (
          <div className="mt-6 w-full max-w-xs animate-slide-up">{action}</div>
        )}
      </div>
    </Wrapper>
  );
};
