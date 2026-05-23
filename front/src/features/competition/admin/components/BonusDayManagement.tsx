import {
  Text,
  Input,
  Button,
  Badge,
  BADGE_VARIANT,
  TEXT_VARIANT,
  TEXT_THEME,
  SectionHeader,
  formatLongDate,
  FORM,
  BUTTONS,
  Row,
  Stack,
  Grid,
} from '@/shared';
import { useBonusDayForm } from '@/features/competition/admin/hooks';
import { COMPETITION_UI } from '@/features/competition/constants';
import type { BonusDay } from '@/features/competition/types';

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
    <Stack gap="md" className="pt-6 border-t border-border-subtle w-full">
      <SectionHeader
        title={COMPETITION_UI.ADMIN.BONUS.TITLE}
        subtitle={COMPETITION_UI.ADMIN.BONUS.SUBTITLE}
        centered
      />

      <Row wrap justify="center" gap="sm" className="w-full">
        {(bonusDays as BonusDay[]).map((bd) => (
          <Badge
            key={bd.id}
            variant={BADGE_VARIANT.BONUS}
            onRemove={() => deleteBonus(bd.id)}
            removeLabel={FORM.BONUS_DAY.BUTTONS.DELETE}
          >
            <span className="font-mono text-[10px]">
              {formatLongDate(bd.date)} —{' '}
              <span className="text-text-muted">x{bd.multiplier}</span>
            </span>
          </Badge>
        ))}

        {bonusDays.length === 0 && (
          <Text
            variant={TEXT_VARIANT.MICRO}
            colorTheme={TEXT_THEME.DIMMED}
            className="italic py-2"
          >
            {FORM.ADMIN.BONUS.EMPTY}
          </Text>
        )}
      </Row>

      <form onSubmit={handleSubmit} noValidate className="w-full">
        <Stack
          gap="md"
          className="bg-surface-base p-4 rounded-2xl border border-border-subtle w-full"
        >
          <Grid cols={1} sm={12} gap="md" className="w-full">
            <div className="sm:col-span-7">
              <Input
                type="date"
                label={FORM.SHARED.LABELS.DATE}
                min={minDate}
                max={maxDate}
                error={errors?.newDate?.message}
                {...register('newDate')}
              />
            </div>

            <div className="sm:col-span-5">
              <Input
                type="number"
                label={FORM.BONUS_DAY.LABELS.MULTIPLIER}
                error={errors?.multiplier?.message}
                {...register('multiplier', { valueAsNumber: true })}
              />
            </div>
          </Grid>

          <Button
            type="submit"
            isLoading={isAdding}
            disabled={!isValid || isAdding}
            fullWidth
            className="cursor-pointer"
          >
            {BUTTONS.ADD}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};
