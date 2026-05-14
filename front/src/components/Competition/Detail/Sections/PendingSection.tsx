import {
  Card,
  Text,
  Badge,
  BADGE_VARIANT,
  TEXT_VARIANT,
  CARD_VARIANT,
} from '@/components/UI';
import { ActionRow } from '@/components/Competition';
import { cn } from '@/utils';
import { COMPETITION_UI } from '@/constants';
import type { Action } from '@/types';
import { useActionTableContext } from '@/context';

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
    <section className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-3 px-1">
        <Text
          variant={TEXT_VARIANT.CAPTION}
          className="text-gold uppercase font-bold tracking-widest opacity-80"
        >
          {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.SUB_SECTIONS.PENDING}
        </Text>
        <Badge variant={BADGE_VARIANT.GHOST} isPulse>
          {total}
        </Badge>
        <div className="h-px flex-1 bg-gold/10 ml-4" />
      </div>

      <div className="space-y-8">
        {sections.map(
          (section) =>
            section.data.length > 0 && (
              <div key={section.label} className="space-y-3">
                <Text
                  variant={TEXT_VARIANT.MICRO}
                  className="ml-4 opacity-40 uppercase font-black italic"
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
              </div>
            ),
        )}
      </div>
    </section>
  );
};
