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

export type GridColumns = 1 | 2 | 3 | 4 | 6 | 8 | 12;

export interface BaseGridProps {
  children?: React.ReactNode;
  cols?: GridColumns;
  sm?: GridColumns;
  md?: GridColumns;
  lg?: GridColumns;
  xl?: GridColumns;
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

export type GridProps<T extends React.ElementType = 'div'> = BaseGridProps & {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof BaseGridProps | 'as'>;

const COLS_MAP = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  8: 'grid-cols-8',
  12: 'grid-cols-12',
};
const SM_MAP = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  6: 'sm:grid-cols-6',
  8: 'sm:grid-cols-8',
  12: 'sm:grid-cols-12',
};
const MD_MAP = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  6: 'md:grid-cols-6',
  8: 'md:grid-cols-8',
  12: 'md:grid-cols-12',
};
const LG_MAP = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  6: 'lg:grid-cols-6',
  8: 'lg:grid-cols-8',
  12: 'lg:grid-cols-12',
};
const XL_MAP = {
  1: 'xl:grid-cols-1',
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  6: 'xl:grid-cols-6',
  8: 'xl:grid-cols-8',
  12: 'xl:grid-cols-12',
};

export const Grid = <T extends React.ElementType = 'div'>({
  as,
  cols = 1,
  sm,
  md,
  lg,
  xl,
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
}: GridProps<T>) => {
  const Tag = as || 'div';
  return (
    <Tag
      className={cn(
        'grid w-full',
        COLS_MAP[cols],
        sm && SM_MAP[sm],
        md && MD_MAP[md],
        lg && LG_MAP[lg],
        xl && XL_MAP[xl],
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
