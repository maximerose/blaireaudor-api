import {
  Badge,
  BADGE_VARIANT,
  cn,
  FORM,
  Input,
  Label,
  Row,
  Stack,
  Switch,
  Text,
  TEXT_THEME,
  TEXT_VARIANT,
} from '@/shared';
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

interface CompetitionDateTimeFieldProps {
  label: string;
  badgeHint?: string;
  dateName: string;
  timeName: string;
  fullDayName: string;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors: FieldErrors<any>;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
}

export const CompetitionDateTimeField = ({
  label,
  badgeHint,
  dateName,
  timeName,
  fullDayName,
  register,
  setValue,
  watch,
  errors,
  disabled = false,
  minDate,
  maxDate,
}: CompetitionDateTimeFieldProps) => {
  const isFullDay = watch(fullDayName);

  return (
    <Stack
      gap="sm"
      className={cn(
        'p-4 rounded-2xl transition-all w-full bg-surface-base border border-border-subtle',
        disabled && 'opacity-40 bg-white/2',
      )}
    >
      {/* En-tête du champ (Label + Badge optionnel) */}
      <Label>
        {label}
        {badgeHint && (
          <Badge variant={BADGE_VARIANT.GHOST} className="text-xs ml-2">
            {badgeHint}
          </Badge>
        )}
      </Label>

      {/* Saisie de la Date */}
      <Input
        type="date"
        disabled={disabled}
        required
        min={minDate}
        max={maxDate}
        error={errors[dateName]?.message as string}
        {...register(dateName)}
      />

      <Row
        align="center"
        justify="center"
        gap="md"
        onClick={() =>
          !disabled && setValue(fullDayName, !isFullDay, { shouldDirty: true })
        }
        className={cn(
          'w-fit self-center px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all select-none',
          !disabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
        )}
      >
        <Text
          variant={TEXT_VARIANT.MICRO}
          colorTheme={isFullDay ? TEXT_THEME.DEFAULT : TEXT_THEME.MUTED}
          className="uppercase font-black tracking-wider transition-colors"
        >
          {FORM.COMPETITION.LABELS.FULL_DAY}
        </Text>

        <Switch checked={isFullDay} onChange={() => {}} />
      </Row>

      {/* Saisie de l'Heure (affichée uniquement si ce n'est pas une journée complète) */}
      {!isFullDay && (
        <Input
          type="time"
          disabled={disabled}
          error={errors[timeName]?.message as string}
          {...register(timeName)}
          className="animate-fade-in"
        />
      )}
    </Stack>
  );
};
