import { useEffect, useRef, useState } from 'react';
import { ICONS } from '@/shared/constants';
import { cn } from '@/shared/utils';
import { Button, BUTTON_SIZE, BUTTON_VARIANT } from './Button';
import { Card, CARD_VARIANT } from './Card';
import { List } from './List';
import { Text, TEXT_VARIANT, TEXT_THEME } from './Text';

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
        className={cn(
          'border-border-base',
          value && 'text-gold border-gold-border',
        )}
        icon={ICONS.CHEVRON_DOWN}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </Button>

      {isOpen && (
        <Card
          variant={CARD_VARIANT.DARK}
          padding="none"
          radius="xl"
          className="absolute top-full left-0 mt-2 z-50 min-w-40 bg-dark-lighter shadow-2xl animate-fade-in"
        >
          <List>
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="w-full px-4 py-3 text-left hover:bg-surface-base transition-default focus:outline-none focus:bg-surface-base group cursor-pointer"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                <Text
                  variant={TEXT_VARIANT.CAPTION}
                  colorTheme={TEXT_THEME.INHERIT}
                  className="group-hover:text-gold transition-default"
                >
                  {opt.label}
                </Text>
              </button>
            ))}
          </List>
        </Card>
      )}
    </div>
  );
};
