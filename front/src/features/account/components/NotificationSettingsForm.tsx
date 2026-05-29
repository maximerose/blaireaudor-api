import {
  NOTIFICATION_SETTINGS_CONFIG,
  PROFILE_UI,
} from '@/features/account/constants';
import { useNotificationSettings } from '@/features/account/hooks';
import type { UpdatePreferencesData } from '@/features/account/validations';
import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Card,
  CARD_VARIANT,
  cn,
  ICONS,
  Row,
  SECTION_HEADER_THEME,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Stack,
  Switch,
  Text,
  TEXT_THEME,
  TEXT_VARIANT,
} from '@/shared';
import type { UseFormReturn } from 'react-hook-form';

interface Props {
  form: UseFormReturn<UpdatePreferencesData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const NotificationSettingsForm = ({ form, onSubmit }: Props) => {
  const {
    preferences,
    isSubmitting,
    isDirty,
    expandedHints,
    toggleHint,
    handleToggle,
  } = useNotificationSettings(form);

  return (
    <Card
      as="form"
      variant={CARD_VARIANT.GLASS}
      onSubmit={onSubmit}
      className="animate-slide-up w-full"
    >
      <Card.Body p="lg" gap="lg">
        <SectionHeader
          variant={SECTION_HEADER_VARIANT.BLOCK}
          title={PROFILE_UI.NOTIFICATIONS_TITLE}
          subtitle={PROFILE_UI.NOTIFICATIONS_SUBTITLE}
          as="h2"
          centered
          colorTheme={SECTION_HEADER_THEME.DEFAULT}
        />

        <Stack gap="lg" className="w-full">
          {NOTIFICATION_SETTINGS_CONFIG.map((group) => (
            <Stack gap="xs" key={group.category} className="w-full">
              <Text
                variant={TEXT_VARIANT.MICRO}
                colorTheme={TEXT_THEME.MUTED}
                className="pl-2 uppercase tracking-widest font-black"
              >
                {group.category}
              </Text>

              <Stack
                gap="none"
                className="w-full divide-y divide-border-subtle bg-black/20 rounded-xl border border-border-subtle overflow-hidden"
              >
                {group.options.map((option) => {
                  const isChecked = preferences[option.id] ?? true;
                  const showHint = expandedHints[option.id];

                  return (
                    <div key={option.id} className="flex flex-col w-full">
                      <Row
                        justify="between"
                        align="center"
                        className="p-4 hover:bg-surface-base transition-default cursor-pointer"
                        onClick={() => handleToggle(option.id)}
                      >
                        <Row gap="md" align="center" className="min-w-0 flex-1">
                          <span
                            className="text-xl opacity-60 text-gold shrink-0"
                            aria-hidden="true"
                          >
                            {option.icon}
                          </span>
                          <Text
                            variant={TEXT_VARIANT.BODY}
                            colorTheme={
                              isChecked ? TEXT_THEME.DEFAULT : TEXT_THEME.DIMMED
                            }
                            className="font-bold leading-tight pr-2 text-left"
                          >
                            {option.label}
                          </Text>
                        </Row>

                        <Row
                          gap="sm"
                          align="center"
                          className="shrink-0 pl-2"
                          fullWidth={false}
                        >
                          {option.hint && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleHint(option.id);
                              }}
                              className={cn(
                                'w-6 h-6 rounded-full flex items-center justify-center transition-default focus:outline-none focus:ring-1 focus:ring-gold',
                                showHint
                                  ? 'bg-gold/20 text-gold'
                                  : 'text-text-dimmed hover:text-gold hover:bg-white/5',
                              )}
                              aria-label="Afficher les détails"
                              title="En savoir plus"
                            >
                              <span aria-hidden="true" className="text-xs">
                                {ICONS.HINT}
                              </span>
                            </button>
                          )}
                          <Switch checked={isChecked} onChange={() => {}} />
                        </Row>
                      </Row>

                      <div
                        className={cn(
                          'transition-all duration-300 ease-in-out overflow-hidden px-4 sm:pl-14 sm:pr-4',
                          showHint
                            ? 'max-h-24 opacity-100 pb-4'
                            : 'max-h-0 opacity-0 pb-0',
                        )}
                      >
                        <Text
                          variant={TEXT_VARIANT.MICRO}
                          colorTheme={TEXT_THEME.DIMMED}
                          className="leading-relaxed"
                        >
                          {option.hint}
                        </Text>
                      </div>
                    </div>
                  );
                })}
              </Stack>
            </Stack>
          ))}
        </Stack>

        <Button
          type="submit"
          variant={BUTTON_VARIANT.PRIMARY}
          size={BUTTON_SIZE.MEDIUM}
          isLoading={isSubmitting}
          disabled={!isDirty || isSubmitting}
          fullWidth
        >
          {PROFILE_UI.NOTIFICATIONS_SAVE}
        </Button>
      </Card.Body>
    </Card>
  );
};
