import type React from 'react';
import { useTextUI, type TextVariant } from '@/hooks';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  htmlFor?: string;
  href?: string;
  target?: string;
}

export const Text = ({
  variant = 'body',
  children,
  className = '',
  as,
  ...props
}: TextProps) => {
  const { Component, combinedClasses } = useTextUI(variant, as, className);

  return (
    <Component className={combinedClasses} {...props}>
      {children}
    </Component>
  );
};
