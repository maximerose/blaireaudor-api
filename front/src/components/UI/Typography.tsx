import React from 'react';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'mono';

interface TextProps {
  variant?: TextVariant;
  children: React.ReactNode;
  className?: string;
  as?: any;
}

const styles: Record<TextVariant, string> = {
  h1: 'text-2xl sm:text-3xl font-black uppercase tracking-tighter italic text-gold',
  h2: 'text-lg sm:text-xl font-bold uppercase tracking-tight text-white',
  h3: 'text-sm sm:text-base font-bold text-gold/80',
  body: 'text-sm text-white/80 leading-relaxed',
  caption: 'text-[10px] font-black uppercase tracking-widest text-white/30',
  mono: 'font-mono font-bold text-sm tracking-normal',
};

export const Text = ({
  variant = 'body',
  children,
  className = '',
  as: Component = 'p',
}: TextProps) => {
  return (
    <Component className={`${styles[variant]} ${className}`}>
      {children}
    </Component>
  );
};
