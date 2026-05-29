export const LAYOUT = {
  GAP: {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  },
  ALIGN: {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  },
  JUSTIFY: {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  },
  P: {
    none: 'p-0',
    xs: 'p-2',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-12',
  },
  PX: {
    none: 'px-0',
    xs: 'px-1 sm:px-2',
    sm: 'px-2 sm:px-4',
    md: 'px-3 sm:px-6',
    lg: 'px-4 sm:px-8',
    xl: 'px-5 sm:px-10',
  },
  PY: {
    none: 'py-0',
    xs: 'py-1 sm:py-2',
    sm: 'py-2 sm:py-4',
    md: 'py-3 sm:py-6',
    lg: 'py-4 sm:py-8',
    xl: 'py-6 sm:py-12',
  },
  MY: {
    none: 'my-0',
    xs: 'my-2',
    sm: 'my-4',
    md: 'my-6',
    lg: 'my-6',
    xl: 'my-8',
  },
  MT: {
    none: 'mt-0',
    xs: 'mt-1',
    sm: 'mt-2',
    md: 'mt-4',
    lg: 'mt-6',
    xl: 'mt-8',
  },
  MB: {
    none: 'mb-0',
    xs: 'mb-1',
    sm: 'mb-2',
    md: 'mb-4',
    lg: 'mb-6',
    xl: 'mb-8',
  },
} as const;

export type LayoutGap = keyof typeof LAYOUT.GAP;
export type LayoutAlign = keyof typeof LAYOUT.ALIGN;
export type LayoutJustify = keyof typeof LAYOUT.JUSTIFY;
export type LayoutP = keyof typeof LAYOUT.P;
export type LayoutPx = keyof typeof LAYOUT.PX;
export type LayoutPy = keyof typeof LAYOUT.PY;
export type LayoutMy = keyof typeof LAYOUT.MY;
export type LayoutMt = keyof typeof LAYOUT.MT;
export type LayoutMb = keyof typeof LAYOUT.MB;
