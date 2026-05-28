import type {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from 'react-hook-form';
import {
  Input,
  Text,
  TEXT_VARIANT,
  AVAILABILITY,
  ICONS,
  Stack,
  formatJoinCode,
  FORM,
} from '@/shared';
import { useJoinCodeCheck } from '@/features/competition/join';
import type React from 'react';

interface CompetitionJoinCodeFieldProps {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
  initialJoinCode?: string;
  fieldName?: string;
  disabled?: boolean;
  renderRight?: React.ReactNode;
  emptyHint?: React.ReactNode;
}

export const CompetitionJoinCodeField = ({
  register,
  watch,
  setValue,
  errors,
  initialJoinCode = '',
  fieldName = 'joinCode',
  disabled = false,
  renderRight,
  emptyHint,
}: CompetitionJoinCodeFieldProps) => {
  const currentJoinCode = watch(fieldName);

  const { status: codeStatus, isLoading: isCodeChecking } = useJoinCodeCheck(
    currentJoinCode,
    initialJoinCode,
  );

  const isCodeChanged = currentJoinCode && currentJoinCode !== initialJoinCode;

  return (
    <Stack gap="xs" align="center" className="w-full">
      <Input
        label={FORM.COMPETITION.LABELS.JOIN_CODE}
        placeholder={FORM.COMPETITION.PLACEHOLDERS.JOIN_CODE}
        align="center"
        required
        disabled={disabled}
        error={errors[fieldName]?.message as string}
        renderRight={renderRight}
        {...register(fieldName, {
          onChange: (e) => {
            setValue(fieldName, formatJoinCode(e.target.value), {
              shouldDirty: true,
            });
          },
        })}
      />

      <div className="h-4 flex justify-center w-full" aria-live="polite">
        {!currentJoinCode && emptyHint ? (
          <Text
            variant={TEXT_VARIANT.MICRO}
            className="italic opacity-30 text-center block"
          >
            {emptyHint}
          </Text>
        ) : isCodeChecking ? (
          <Text
            variant={TEXT_VARIANT.MICRO}
            className="text-gold animate-pulse text-center"
          >
            {FORM.COMPETITION.HINTS.JOIN_CODE_CHECK}
          </Text>
        ) : isCodeChanged && codeStatus === AVAILABILITY.AVAILABLE ? (
          <Text
            variant={TEXT_VARIANT.MICRO}
            className="text-success-bright flex items-center justify-center gap-1"
          >
            <span aria-hidden="true">{ICONS.SUCCESS}</span>
            {FORM.COMPETITION.HINTS.JOIN_CODE_AVAILABLE}
          </Text>
        ) : isCodeChanged && codeStatus === AVAILABILITY.TAKEN ? (
          <Text
            variant={TEXT_VARIANT.MICRO}
            className="text-danger-bright flex items-center justify-center gap-1"
          >
            <span aria-hidden="true">{ICONS.FAILURE}</span>
            {FORM.COMPETITION.HINTS.JOIN_CODE_TAKEN}
          </Text>
        ) : null}
      </div>
    </Stack>
  );
};
