import {
  Text,
  Input,
  Button,
  Badge,
  BADGE_VARIANT,
  TEXT_VARIANT,
} from '@/components/UI';
import { formatLongDate } from '@/utils';
import { useBonusDayForm } from '@/hooks';
import { COMPETITION_UI, FORM, ICONS, BUTTONS } from '@/constants';
import type { BonusDay } from '@/types';

export const BonusDayManagement = () => {
  const {
    newDate,
    setNewDate,
    multiplier,
    setMultiplier,
    handleAdd,
    deleteBonus,
    isAdding,
    bonusDays,
    minDate,
    maxDate,
  } = useBonusDayForm();

  return (
    <div className="space-y-6 pt-6 border-t border-white/5">
      <header className="flex flex-col gap-1">
        <Text variant={TEXT_VARIANT.H3} className="text-gold">
          {COMPETITION_UI.ADMIN.BONUS.TITLE}
        </Text>
        <Text variant={TEXT_VARIANT.MICRO} className="opacity-30">
          {COMPETITION_UI.ADMIN.BONUS.SUBTITLE}
        </Text>
      </header>

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
      <div className="flex flex-col gap-3 bg-white/2 p-4 rounded-2xl border border-white/5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-2/3">
            <Input
              type="date"
              label={FORM.SHARED.LABELS.DATE}
              value={newDate}
              min={minDate}
              max={maxDate}
              onKeyDown={(e) => e.preventDefault()}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-1/3">
            <Input
              type="number"
              label={FORM.BONUS_DAY.LABELS.MULTIPLIER}
              min={2}
              value={multiplier}
              onChange={(e) => setMultiplier(parseInt(e.target.value))}
            />
          </div>
        </div>
        <Button
          onClick={handleAdd}
          isLoading={isAdding}
          disabled={!newDate}
          fullWidth
        >
          {BUTTONS.ADD}
        </Button>
      </div>
    </div>
  );
};
