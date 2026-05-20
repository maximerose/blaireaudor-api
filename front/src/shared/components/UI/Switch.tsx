import { cn } from '@/shared/utils';

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export const Switch = ({ checked, onChange }: SwitchProps) => {
  return (
    <div
      onClick={onChange}
      className={cn(
        'w-9 h-5 rounded-full relative transition-all duration-300 cursor-pointer shrink-0',
        checked ? 'bg-gold' : 'bg-white/10',
      )}
    >
      <div
        className={cn(
          'absolute top-1 w-3 h-3 bg-dark rounded-full transition-all duration-300 shadow-sm',
          checked ? 'translate-x-5' : 'translate-x-1',
        )}
      />
    </div>
  );
};
