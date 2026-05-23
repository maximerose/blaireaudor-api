import React from 'react';
import { cn } from '@/shared/utils';
import {
  LAYOUT,
  type LayoutGap,
  type LayoutAlign,
  type LayoutJustify,
  type LayoutP,
  type LayoutPx,
  type LayoutPy,
  type LayoutMt,
  type LayoutMb,
} from '@/shared/constants';

export interface BaseRowProps {
  children?: React.ReactNode;
  gap?: LayoutGap;
  align?: LayoutAlign;
  justify?: LayoutJustify;
  p?: LayoutP;
  px?: LayoutPx;
  py?: LayoutPy;
  mt?: LayoutMt;
  mb?: LayoutMb;
  wrap?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export type RowProps<T extends React.ElementType = 'div'> = BaseRowProps & {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof BaseRowProps | 'as'>;

export const Row = <T extends React.ElementType = 'div'>({
  as,
  gap = 'sm',
  align = 'center',
  justify = 'start',
  wrap = false,
  p,
  px,
  py,
  mt,
  mb,
  fullWidth = true,
  className,
  children,
  ...props
}: RowProps<T>) => {
  const Tag = as || 'div';

  return (
    <Tag
      className={cn(
        'flex',
        fullWidth && 'w-full',
        wrap && 'flex-wrap',
        LAYOUT.GAP[gap],
        LAYOUT.ALIGN[align],
        LAYOUT.JUSTIFY[justify],
        p && LAYOUT.P[p],
        px && LAYOUT.PX[px],
        py && LAYOUT.PY[py],
        mt && LAYOUT.MT[mt],
        mb && LAYOUT.MB[mb],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};
