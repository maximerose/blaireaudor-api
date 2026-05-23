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

export interface BaseStackProps {
  children?: React.ReactNode;
  gap?: LayoutGap;
  align?: LayoutAlign;
  justify?: LayoutJustify;
  p?: LayoutP;
  px?: LayoutPx;
  py?: LayoutPy;
  mt?: LayoutMt;
  mb?: LayoutMb;
  className?: string;
}

export type StackProps<T extends React.ElementType = 'div'> = BaseStackProps & {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof BaseStackProps | 'as'>;

export const Stack = <T extends React.ElementType = 'div'>({
  as,
  gap = 'md',
  align = 'stretch',
  justify,
  p,
  px,
  py,
  mt,
  mb,
  className,
  children,
  ...props
}: StackProps<T>) => {
  const Tag = as || 'div';
  return (
    <Tag
      className={cn(
        'flex flex-col w-full min-w-0',
        LAYOUT.GAP[gap],
        LAYOUT.ALIGN[align],
        justify && LAYOUT.JUSTIFY[justify],
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
