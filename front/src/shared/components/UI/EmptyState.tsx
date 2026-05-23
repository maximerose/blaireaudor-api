import React from 'react';
import { Text, TEXT_VARIANT } from './Text';
import { useEmptyStateUI } from '@/shared/hooks';
import { ICONS, UI } from '@/shared/constants';
import { Stack } from '../Layout/Stack';

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
      <Stack
        align="center"
        justify="center"
        p="xl"
        gap="sm"
        className="text-center animate-fade-in"
      >
        <div
          className="text-3xl sm:text-4xl opacity-30 mb-2 animate-bounce-subtle select-none"
          aria-hidden="true"
        >
          {icon}
        </div>

        <Text
          variant={TEXT_VARIANT.CAPTION}
          className="text-text-muted font-bold uppercase tracking-widest"
        >
          {title}
        </Text>

        {message && (
          <Text
            variant={TEXT_VARIANT.BODY}
            className="text-text-dimmed text-[10px] sm:text-xs italic leading-tight"
          >
            {message}
          </Text>
        )}

        {action && (
          <div className="mt-4 w-full max-w-xs animate-slide-up">{action}</div>
        )}
      </Stack>
    </Wrapper>
  );
};
