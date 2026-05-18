import { ICONS } from '@/constants';
import type React from 'react';
import { Text, TEXT_VARIANT } from './Text';
import { cn } from '@/utils';

export const ALERT_VARIANT = {
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  SUCCESS: 'success',
} as const;

export type AlertVariant = (typeof ALERT_VARIANT)[keyof typeof ALERT_VARIANT];

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
}

const ALERT_STYLES: Record<AlertVariant, string> = {
  [ALERT_VARIANT.DANGER]:
    'bg-danger/10 border-danger-bright/30 text-danger-bright',
  [ALERT_VARIANT.WARNING]:
    'bg-warning/10 border-warning-bright/30 text-warning-bright',
  [ALERT_VARIANT.INFO]: 'bg-info/10 border-info-bright/30 text-info-bright',
  [ALERT_VARIANT.SUCCESS]:
    'bg-success/10 border-success-bright/30 text-success-bright',
};

const ALERT_ICONS: Record<AlertVariant, string> = {
  [ALERT_VARIANT.DANGER]: ICONS.DANGER,
  [ALERT_VARIANT.WARNING]: ICONS.ALARM,
  [ALERT_VARIANT.INFO]: ICONS.HINT,
  [ALERT_VARIANT.SUCCESS]: ICONS.SUCCESS,
};

export const Alert = ({
  variant = ALERT_VARIANT.DANGER,
  title,
  children,
  className,
  ...props
}: AlertProps) => {
  return (
    <div
      className={cn(
        'p-1 border rounded-xl flex gap-3 justify-center animate-fade-in',
        ALERT_STYLES[variant],
        className,
      )}
      role="alert"
      {...props}
    >
      <span className="text-xl shrink-0" aria-hidden="true">
        {ALERT_ICONS[variant]}
      </span>
      <div className="flex flex-col justify-center min-w-0">
        {title && (
          <Text
            variant={TEXT_VARIANT.H3}
            className="text-inherit mb-1 truncate"
          >
            {title}
          </Text>
        )}
        <Text
          variant={TEXT_VARIANT.BODY}
          className="text-inherit text-sm opacity-90 leading-tight"
        >
          {children}
        </Text>
      </div>
    </div>
  );
};
