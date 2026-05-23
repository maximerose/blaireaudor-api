import { cn, getPasswordStrength, Row } from '@/shared';

interface PasswordStrengthProps {
  password?: string;
  className?: string;
}

export const PasswordStrength = ({
  password,
  className,
}: PasswordStrengthProps) => {
  if (!password || password.length === 0) return null;

  const strength = getPasswordStrength(password);

  return (
    <Row
      gap="xs"
      px="xs"
      align="stretch"
      className={cn('h-1', className)}
      aria-hidden="true"
    >
      {[1, 2, 3, 4].map((level) => (
        <div
          key={level}
          className={cn(
            'flex-1 rounded-full transition-default',
            strength >= level
              ? strength < 2
                ? 'bg-danger'
                : strength < 4
                  ? 'bg-warning'
                  : 'bg-success-bright'
              : 'bg-surface-raised',
          )}
        />
      ))}
    </Row>
  );
};
