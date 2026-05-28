import {
  CompetitionDateTimeField,
  CompetitionJoinCodeField,
  CompetitionNameField,
} from '@/features/competition/fields';
import { useJoinCodeCheck } from '@/features/competition/join';
import type { CreateCompetitionFormData } from '@/features/competition/validations';
import {
  AVAILABILITY,
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  BUTTONS,
  Card,
  CARD_VARIANT,
  FORM,
  generateClientSideCode,
  Grid,
  ICONS,
  Row,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Stack,
  Switch,
  Text,
  TEXT_THEME,
  TEXT_VARIANT,
} from '@/shared';
import type { UseFormReturn } from 'react-hook-form';

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

  const handleGenerateCode = () => {
    setValue('joinCode', generateClientSideCode(), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <Stack gap="xl" className="animate-slide-up w-full">
      <SectionHeader
        variant={SECTION_HEADER_VARIANT.TITLE}
        as="h1"
        title={FORM.COMPETITION.STEPS.CONFIG.TITLE}
        subtitle={FORM.COMPETITION.STEPS.CONFIG.SUBTITLE}
        centered
      />

      <Stack gap="md" className="w-full">
        <CompetitionNameField register={register} errors={errors} />

        <CompetitionJoinCodeField
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
          emptyHint={FORM.COMPETITION.HINTS.JOIN_CODE}
          renderRight={
            <Button
              type="button"
              variant={BUTTON_VARIANT.GHOST}
              size={BUTTON_SIZE.SMALL}
              onClick={handleGenerateCode}
              icon={ICONS.STARS}
            >
              {BUTTONS.AUTO}
            </Button>
          }
        />

        <Grid cols={1} sm={2} gap="md" className="w-full">
          <CompetitionDateTimeField
            label={FORM.COMPETITION.LABELS.START}
            dateName="startDate"
            timeName="startTime"
            fullDayName="startFullDay"
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />

          <CompetitionDateTimeField
            label={FORM.COMPETITION.LABELS.END}
            dateName="endDate"
            timeName="endTime"
            fullDayName="endFullDay"
            minDate={watchStartDate}
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />
        </Grid>

        <Stack gap="sm" className="w-full">
          {toggles.map((toggle) => (
            <Card key={toggle.id} variant={CARD_VARIANT.DARK}>
              <Row
                align="center"
                justify="between"
                className="p-4 cursor-pointer w-full"
                onClick={() =>
                  setValue(toggle.id, !toggle.active, { shouldDirty: true })
                }
              >
                <Stack gap="none" className="text-left flex-1 pr-4">
                  <Text
                    variant={TEXT_VARIANT.CAPTION}
                    colorTheme={
                      toggle.active ? TEXT_THEME.GOLD : TEXT_THEME.DIMMED
                    }
                  >
                    {toggle.label}
                  </Text>
                  <Text
                    variant={TEXT_VARIANT.MICRO}
                    colorTheme={TEXT_THEME.DIMMED}
                    className="italic mt-1"
                  >
                    {toggle.sub}
                  </Text>
                </Stack>
                <Switch
                  checked={toggle.active as boolean}
                  onChange={() => {}}
                />
              </Row>
            </Card>
          ))}
        </Stack>
      </Stack>

      <Button
        fullWidth
        type="button"
        disabled={!canNext}
        onClick={onNext}
        size={BUTTON_SIZE.MEDIUM}
        icon={ICONS.ARROW_BIG_RIGHT}
        iconPosition="right"
      >
        {BUTTONS.CONTINUE}
      </Button>
    </Stack>
  );
};
