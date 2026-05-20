import {
  Text,
  Input,
  Button,
  Badge,
  BADGE_VARIANT,
  TEXT_VARIANT,
  SectionHeader,
  formatLongDate,
  FORM,
  ICONS,
  BUTTONS,
} from '@/shared';
import { useBonusDayForm } from '@/hooks';
import { COMPETITION_UI } from '@/constants';
import type { BonusDay } from '@/types';

export const BonusDayManagement = () => {
  const {
    register,
    handleSubmit,
    errors,
    isValid,
    deleteBonus,
    isAdding,
    bonusDays,
    minDate,
    maxDate,
  } = useBonusDayForm();

  return (
    <div className="space-y-4 pt-6 border-t border-white/10">
      <SectionHeader
        title={COMPETITION_UI.ADMIN.BONUS.TITLE}
        subtitle={COMPETITION_UI.ADMIN.BONUS.SUBTITLE}
        centered
      />

      <div className="flex flex-wrap justify-center gap-2">
        {bonusDays.map((bd: BonusDay) => (
          <Badge
            key={bd.id}
            variant={BADGE_VARIANT.BONUS}
            className="pl-3 pr-1 gap-3"
          >
            <span className="font-mono text-[10px]">
              {formatLongDate(bd.date)} —{' '}
              <span className="text-silver-light">x{bd.multiplier}</span>
            </span>
            <button
              type="button"
              onClick={() => deleteBonus(bd.id)}
              className="w-5 h-5 flex items-center justify-center rounded-md text-game-bonus-bright hover:text-game-bonus transition-default"
              aria-label={FORM.BONUS_DAY.BUTTONS.DELETE}
            >
              {ICONS.CANCEL}
            </button>
          </Badge>
        ))}

        {bonusDays.length === 0 && (
          <Text variant={TEXT_VARIANT.MICRO} className="italic opacity-20 py-2">
            {FORM.ADMIN.BONUS.EMPTY}
          </Text>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 bg-white/2 p-4 rounded-2xl border border-white/5"
        noValidate
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-2/3">
            <Input
              type="date"
              label={FORM.SHARED.LABELS.DATE}
              min={minDate}
              max={maxDate}
              error={errors?.newDate?.message}
              {...register('newDate')}
            />
          </div>
          <div className="w-full sm:w-1/3">
            <Input
              type="number"
              label={FORM.BONUS_DAY.LABELS.MULTIPLIER}
              error={errors?.multiplier?.message}
              {...register('multiplier', { valueAsNumber: true })}
            />
          </div>
        </div>
        <Button
          type="submit"
          isLoading={isAdding}
          disabled={!isValid || isAdding}
          fullWidth
        >
          {BUTTONS.ADD}
        </Button>
      </form>
    </div>
  );
};
