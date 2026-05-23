import { cn } from '@/shared/utils';

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export const Switch = ({ checked, onChange, label }: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        'w-9 h-5 rounded-full relative transition-default outline-none shrink-0 border border-transparent',
        'focus-visible:ring-2 focus-visible:ring-gold-border focus-visible:ring-offset-2 focus-visible:ring-offset-dark',
        checked ? 'bg-gold' : 'bg-surface-raised',
      )}
    >
      <div
        className={cn(
          'absolute top-0.5 w-3 h-3 bg-dark rounded-full transition-default shadow-sm',
          checked ? 'left-5' : 'left-1',
        )}
      />
    </button>
  );
};
