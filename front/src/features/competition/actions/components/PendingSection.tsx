import {
  Card,
  Text,
  Badge,
  BADGE_VARIANT,
  TEXT_VARIANT,
  TEXT_THEME,
  CARD_VARIANT,
  cn,
  Stack,
  SectionHeader,
  SECTION_HEADER_VARIANT,
  ICONS,
  SECTION_HEADER_THEME,
} from '@/shared';
import { useActionTableContext } from '@/features/competition/context';
import { COMPETITION_UI } from '@/features/competition/constants';
import { ActionRow } from './ActionRow';
import type { Action } from '@/features/competition/types';

export const PendingSection = () => {
  const { categories } = useActionTableContext();
  const { myPending, othersPending } = categories;

  const total = myPending.length + othersPending.length;

  if (total === 0) return null;

  const sections = [
    {
      label: COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.SUB_SECTIONS.MY_SUBMISSIONS,
      data: myPending,
      border: 'border-gold/20 shadow-gold/5',
    },
    {
      label:
        COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.SUB_SECTIONS.OTHER_SUBMISSIONS,
      data: othersPending,
      border: 'border-white/5',
    },
  ] as const;

  return (
    <Stack as="section" gap="lg" className="animate-slide-up">
      <SectionHeader
        variant={SECTION_HEADER_VARIANT.DIVIDER}
        colorTheme={SECTION_HEADER_THEME.GOLD}
        icon={ICONS.REFEREE}
        title={COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.SUB_SECTIONS.PENDING}
        rightElement={
          <Badge variant={BADGE_VARIANT.GHOST} isPulse>
            {total}
          </Badge>
        }
      />

      <Stack gap="xl">
        {sections.map(
          (section) =>
            section.data.length > 0 && (
              <Stack key={section.label} gap="xs">
                <Text
                  variant={TEXT_VARIANT.MICRO}
                  colorTheme={TEXT_THEME.DIMMED}
                  className="ml-4 uppercase font-black italic"
                >
                  {section.label}
                </Text>

                <Card
                  variant={CARD_VARIANT.DARK}
                  className={cn(
                    'overflow-hidden divide-y divide-white/5',
                    section.border,
                  )}
                >
                  {section.data.map((action: Action) => (
                    <ActionRow key={action.id} action={action} />
                  ))}
                </Card>
              </Stack>
            ),
        )}
      </Stack>
    </Stack>
  );
};
