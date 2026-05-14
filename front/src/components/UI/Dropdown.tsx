import { useEffect, useRef, useState } from 'react';
import { ICONS } from '@/constants';
import { cn } from '@/utils';
import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Card,
  CARD_VARIANT,
} from '@/components/UI';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
  className?: string;
}

export const Dropdown = ({
  options,
  value,
  onChange,
  placeholder,
  className,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const close = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setIsOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className={cn('relative inline-block', className)} ref={containerRef}>
      <Button
        variant={BUTTON_VARIANT.GHOST}
        size={BUTTON_SIZE.SMALL}
        onClick={() => setIsOpen(!isOpen)}
        className={cn('border-white/10', value && 'text-gold border-gold/30')}
        icon={ICONS.CHEVRON_DOWN}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </Button>

      {isOpen && (
        <Card
          variant={CARD_VARIANT.DARK}
          className="bg-dark absolute top-full left-0 mt-2 z-50 min-w-40 shadow-2xl border-white/10 animate-fade-in overflow-hidden"
        >
          <div className="flex flex-col">
            {options.map((opt) => (
              <button
                key={opt.value}
                className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest hover:bg-gold/10 hover:text-gold transition-colors border-b border-white/5 last:border-0"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
