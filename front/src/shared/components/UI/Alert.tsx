// front/src/shared/components/UI/Alert.tsx

import type React from 'react';
import { ICONS } from '@/shared/constants';
import { cn } from '@/shared/utils';
import { Text, TEXT_VARIANT, TEXT_THEME } from './Text';
import { Row, Stack } from '../Layout';

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
    'bg-danger-soft border-danger-border text-danger-bright',
  [ALERT_VARIANT.WARNING]:
    'bg-warning-soft border-warning-border text-warning-bright',
  [ALERT_VARIANT.INFO]: 'bg-info-soft border-info-border text-info-bright',
  [ALERT_VARIANT.SUCCESS]:
    'bg-success-soft border-success-border text-success-bright',
};

const ALERT_ICONS: Record<AlertVariant, React.ReactNode> = {
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
    <Row
      gap="sm"
      p="xs"
      align="center"
      className={cn(
        'border rounded-xl animate-fade-in',
        ALERT_STYLES[variant],
        className,
      )}
      role="alert"
      {...props}
    >
      <span className="text-xl shrink-0" aria-hidden="true">
        {ALERT_ICONS[variant]}
      </span>

      <Stack justify="center" gap="none">
        {title && (
          <Text
            variant={TEXT_VARIANT.H3}
            colorTheme={TEXT_THEME.INHERIT}
            className="truncate"
          >
            {title}
          </Text>
        )}
        <Text variant={TEXT_VARIANT.BODY} colorTheme={TEXT_THEME.INHERIT}>
          {children}
        </Text>
      </Stack>
    </Row>
  );
};
