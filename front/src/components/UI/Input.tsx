import React from 'react';
import { Text } from '@/components/UI';
import { useInputUI } from '@/hooks';
import { cn } from '@/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string | React.ReactNode;
  renderRight?: React.ReactNode;
  align?: 'left' | 'center';
}

export const Input = ({
  label,
  icon,
  renderRight,
  align = 'center',
  className = '',
  id,
  ...props
}: InputProps) => {
  const { inputId, labelClasses, inputClasses } = useInputUI(id, {
    align,
    icon,
    className: className,
  });

  const isDateOrTime = props.type === 'date' || props.type === 'time';

  const shadowDomClasses =
    isDateOrTime && align === 'center'
      ? cn(
          // Force l'affichage bloc pour pouvoir aligner
          '[&::-webkit-datetime-edit]:block [&::-webkit-datetime-edit]:text-center',
          // Utilise flexbox pour centrer parfaitement les segments de la date
          '[&::-webkit-datetime-edit-fields-wrapper]:inline-flex [&::-webkit-datetime-edit-fields-wrapper]:justify-center [&::-webkit-datetime-edit-fields-wrapper]:w-full pl-5',
          // Sort l'icône calendrier du flux (absolute) pour éviter le décalage
          '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4',
          // Stylise l'icône en modifiant son curseur et son apparence
          '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
          // Astuce : filtre CSS pour s'approcher du "gold" / jaune sur fond sombre
          '[&::-webkit-calendar-picker-indicator]:invert-[0.8] [&::-webkit-calendar-picker-indicator]:sepia-[1] [&::-webkit-calendar-picker-indicator]:saturate-[5] [&::-webkit-calendar-picker-indicator]:hue-rotate-[10deg] [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 transition-opacity',
        )
      : '';

  return (
    <div className="w-full space-y-1">
      {label && (
        <Text
          as="label"
          htmlFor={inputId}
          variant="caption"
          className={labelClasses}
        >
          {label}
          {props.required && (
            <span className="ml-1 text-danger-bright" aria-hidden="true">
              *
            </span>
          )}
        </Text>
      )}

      <div className="relative flex items-center group">
        {icon && (
          <span
            className="absolute left-4 text-gold/30 group-focus-within:text-gold transition-default text-xs pointer-events-none"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <input
          id={inputId}
          {...props}
          className={cn(inputClasses, shadowDomClasses)}
        />

        {renderRight && (
          <div className="absolute right-2 h-full top-1/2 -translate-y-1/2 flex items-center">
            {renderRight}
          </div>
        )}
      </div>
    </div>
  );
};
