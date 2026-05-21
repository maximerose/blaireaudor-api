import { cn, getPasswordStrength } from '@/shared';

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
    <div
      className={cn('flex gap-1 mt-1 px-1 h-1', className)}
      aria-hidden="true"
    >
      {[1, 2, 3, 4].map((level) => (
        <div
          key={level}
          className={cn(
            'flex-1 rounded-full transition-all duration-300',
            strength >= level
              ? strength < 2
                ? 'bg-danger'
                : strength < 4
                  ? 'bg-warning'
                  : 'bg-success-bright'
              : 'bg-white/10',
          )}
        />
      ))}
    </div>
  );
};
