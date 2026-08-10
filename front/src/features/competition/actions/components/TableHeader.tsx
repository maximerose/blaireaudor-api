import { COMPETITION_UI } from '@/features/competition/constants';
import { useActionTableContext } from '@/features/competition/context';
import type { ActionSortField } from '@/features/competition/types';
import { cn, Grid, Text, TEXT_THEME, TEXT_VARIANT } from '@/shared';

interface Column {
  id: ActionSortField;
  label: string;
  colSpan: string;
  align: 'text-left' | 'text-center' | 'text-right';
  noSort?: boolean;
}

const TABLE_COLUMNS: Column[] = [
  {
    id: 'date_action',
    label: COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.TABLE.COLUMN_DATE,
    colSpan: 'col-span-3 md:col-span-2',
    align: 'text-left',
  },
  {
    id: 'player',
    label: COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.TABLE.COLUMN_PLAYER,
    colSpan: 'hidden md:block md:col-span-3',
    align: 'text-center',
  },
  {
    id: 'description',
    label: COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.TABLE.COLUMN_ACTION,
    colSpan: 'col-span-6 md:col-span-5',
    align: 'text-center',
    noSort: true,
  },
  {
    id: 'points',
    label: COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.TABLE.COLUMN_POINTS,
    colSpan: 'col-span-3 md:col-span-2',
    align: 'text-right',
  },
];

export const TableHeader = () => {
  const { handleSort, getAriaSort, getSortIndicator } = useActionTableContext();

  return (
    <Grid
      cols={12}
      gap="xs"
      align="center"
      className="px-4 py-2 bg-white/5 rounded-t-3xl border-x border-t border-border-base"
    >
      <div role="row" className="contents">
        {TABLE_COLUMNS.map((col) => {
          const indicator = getSortIndicator(col.id);
          return (
            <div
              key={col.id}
              className={col.colSpan}
              role="columnheader"
              aria-sort={col.noSort ? undefined : getAriaSort(col.id)}
            >
              {!col.noSort ? (
                <button
                  type="button"
                  className={cn(
                    'w-full flex items-center group transition-default hover:text-gold cursor-pointer focus:outline-none',
                    col.align === 'text-center' && 'justify-center',
                    col.align === 'text-right' && 'justify-end',
                  )}
                  onClick={() => handleSort(col.id)}
                >
                  <Text
                    variant={TEXT_VARIANT.MICRO}
                    colorTheme={TEXT_THEME.DIMMED}
                    className="text-inherit uppercase font-black tracking-widest"
                  >
                    {col.label}
                  </Text>
                  <span className={indicator.className}>{indicator.char}</span>
                </button>
              ) : (
                <Text
                  variant={TEXT_VARIANT.MICRO}
                  colorTheme={TEXT_THEME.DIMMED}
                  className="uppercase font-black tracking-widest text-center"
                >
                  {col.label}
                </Text>
              )}
            </div>
          );
        })}
      </div>
    </Grid>
  );
};
