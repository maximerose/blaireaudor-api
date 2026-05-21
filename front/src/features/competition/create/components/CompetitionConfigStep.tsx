import {
  Input,
  Button,
  Text,
  Card,
  Switch,
  TEXT_VARIANT,
  CARD_VARIANT,
  Label,
  SectionHeader,
  SECTION_HEADER_VARIANT,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  FORM,
  ICONS,
  BUTTONS,
  AVAILABILITY,
  cn,
  formatJoinCode,
  generateClientSideCode,
} from '@/shared';
import type React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateCompetitionFormData } from '@/features/competition/validations';
import { useJoinCodeCheck } from '@/features/competition/join';

interface ConfigStepProps {
  formMethods: UseFormReturn<CreateCompetitionFormData>;
  onNext: () => void;
}

export const CompetitionConfigStep = ({
  formMethods,
  onNext,
}: ConfigStepProps) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = formMethods;

  const startFullDay = watch('startFullDay');
  const endFullDay = watch('endFullDay');
  const fogOfWar = watch('fogOfWar');
  const participate = watch('participate');
  const watchStartDate = watch('startDate');
  const currentJoinCode = watch('joinCode');

  const watchName = watch('name');

  const { status: codeStatus, isLoading: isCodeChecking } =
    useJoinCodeCheck(currentJoinCode);
  const canNext =
    !!watchName &&
    !!watchStartDate &&
    codeStatus !== AVAILABILITY.TAKEN &&
    !isCodeChecking;

  const toggles = [
    {
      id: 'fogOfWar' as const,
      label: FORM.COMPETITION.LABELS.FOG_OF_WAR,
      sub: FORM.COMPETITION.HINTS.FOG_OF_WAR,
      active: fogOfWar,
    },
    {
      id: 'participate' as const,
      label: FORM.COMPETITION.LABELS.PARTICIPATE,
      sub: FORM.COMPETITION.HINTS.PARTICIPATE,
      active: participate,
    },
  ];

  const handleJoinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('joinCode', formatJoinCode(e.target.value), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleGenerateCode = () => {
    setValue('joinCode', generateClientSideCode(), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <SectionHeader
        variant={SECTION_HEADER_VARIANT.TITLE}
        as="h1"
        title={FORM.COMPETITION.STEPS.CONFIG.TITLE}
        subtitle={FORM.COMPETITION.STEPS.CONFIG.SUBTITLE}
        centered
      />

      <div className="space-y-4">
        <Input
          label={FORM.COMPETITION.LABELS.NAME}
          placeholder={FORM.COMPETITION.PLACEHOLDERS.NAME}
          required
          align="center"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="space-y-1">
          <div className="relative flex items-center group">
            <Input
              label={FORM.COMPETITION.LABELS.JOIN_CODE}
              align="center"
              placeholder={FORM.COMPETITION.PLACEHOLDERS.JOIN_CODE}
              error={errors.joinCode?.message}
              {...register('joinCode', { onChange: handleJoinCodeChange })}
              renderRight={
                <Button
                  type="button"
                  variant={BUTTON_VARIANT.GHOST}
                  size={BUTTON_SIZE.SMALL}
                  onClick={handleGenerateCode}
                  icon={ICONS.STARS}
                  className="bg-gold/5 border border-gold/10 hover:bg-gold/10 text-gold/60 hover:text-gold"
                >
                  {BUTTONS.AUTO}
                </Button>
              }
            />
          </div>
          <div className="h-4 flex justify-center" aria-live="polite">
            {!currentJoinCode ? (
              <Text
                variant={TEXT_VARIANT.MICRO}
                className="italic opacity-30 text-center block"
              >
                {FORM.COMPETITION.HINTS.JOIN_CODE}
              </Text>
            ) : isCodeChecking ? (
              <Text
                variant={TEXT_VARIANT.MICRO}
                className="text-gold animate-pulse text-center"
              >
                {FORM.COMPETITION.HINTS.JOIN_CODE_CHECK}
              </Text>
            ) : codeStatus === AVAILABILITY.AVAILABLE ? (
              <Text
                variant={TEXT_VARIANT.MICRO}
                className="text-success-bright text-center"
              >
                <span className="mr-1" aria-hidden="true">
                  {ICONS.SUCCESS}
                </span>
                {FORM.COMPETITION.HINTS.JOIN_CODE_AVAILABLE}
              </Text>
            ) : codeStatus === AVAILABILITY.TAKEN ? (
              <Text
                variant={TEXT_VARIANT.MICRO}
                className="text-danger-bright text-center"
              >
                <span className="mr-1" aria-hidden="true">
                  {ICONS.FAILURE}
                </span>
                {FORM.COMPETITION.HINTS.JOIN_CODE_TAKEN}
              </Text>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
            <Label required>{FORM.COMPETITION.LABELS.START}</Label>
            <Input
              type="date"
              required
              error={errors.startDate?.message}
              {...register('startDate')}
            />
            <Card
              variant={CARD_VARIANT.DARK}
              onClick={() =>
                setValue('startFullDay', !startFullDay, { shouldDirty: true })
              }
              className="flex items-center justify-between py-2 px-3 group cursor-pointer transition-default border-transparent bg-transparent shadow-none"
            >
              <Text
                variant={TEXT_VARIANT.MICRO}
                className={startFullDay ? 'text-white' : 'text-white/50'}
              >
                {FORM.COMPETITION.LABELS.FULL_DAY}
              </Text>
              <Switch checked={startFullDay} onChange={() => {}} />
            </Card>
            {!startFullDay && (
              <div className="animate-slide-down">
                <Input
                  type="time"
                  error={errors.startTime?.message}
                  {...register('startTime')}
                />
              </div>
            )}
          </div>

          <div className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
            <Label>{FORM.COMPETITION.LABELS.END}</Label>
            <Input
              type="date"
              min={watchStartDate}
              error={errors.endDate?.message}
              {...register('endDate')}
            />
            <Card
              variant={CARD_VARIANT.DARK}
              onClick={() =>
                setValue('endFullDay', !endFullDay, { shouldDirty: true })
              }
              className="flex items-center justify-between py-2 px-3 group cursor-pointer transition-default border-transparent bg-transparent shadow-none"
            >
              <Text
                variant={TEXT_VARIANT.MICRO}
                className={endFullDay ? 'text-white' : 'text-white/50'}
              >
                {FORM.COMPETITION.LABELS.FULL_DAY}
              </Text>
              <Switch checked={endFullDay} onChange={() => {}} />
            </Card>
            {!endFullDay && (
              <div className="animate-slide-down">
                <Input
                  type="time"
                  error={errors.endTime?.message}
                  {...register('endTime')}
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {toggles.map((toggle) => (
            <Card
              key={toggle.id}
              variant={CARD_VARIANT.DARK}
              onClick={() =>
                setValue(toggle.id, !toggle.active, { shouldDirty: true })
              }
              className={cn(
                'flex items-center justify-between py-3 px-4 group cursor-pointer transition-default hover:border-gold/30',
                toggle.active ? 'border-gold/30' : 'border-white/5',
              )}
            >
              <div className="flex flex-col text-left">
                <Text
                  variant={TEXT_VARIANT.CAPTION}
                  className={cn(
                    'transition-default',
                    toggle.active ? 'text-gold' : 'text-gold/50',
                  )}
                >
                  {toggle.label}
                </Text>
                <Text
                  variant={TEXT_VARIANT.MICRO}
                  className="italic mt-1 opacity-20"
                >
                  {toggle.sub}
                </Text>
              </div>
              <div
                className={cn(
                  'w-8 h-4 rounded-full relative transition-default',
                  toggle.active ? 'bg-gold' : 'bg-white/10',
                )}
              >
                <div
                  className={cn(
                    'absolute top-0.5 w-3 h-3 bg-dark rounded-full transition-default',
                    toggle.active ? 'left-4.5' : 'left-0.5',
                  )}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Button
        fullWidth
        type="button"
        disabled={!canNext}
        onClick={onNext}
        size={BUTTON_SIZE.MEDIUM}
      >
        {BUTTONS.CONTINUE}
      </Button>
    </div>
  );
};
