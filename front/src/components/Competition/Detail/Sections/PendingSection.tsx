import { Card, Text, Badge } from '@/components/UI';
import { ActionRow } from '@/components/Competition';
import { cn } from '@/utils';
import { COMPETITION_UI } from '@/constants';

export const PendingSection = ({
  myPending,
  othersPending,
  onUpdate,
  onStatusChange,
}: any) => {
  const total = myPending.length + othersPending.length;
  if (total === 0) return null;

  return (
    <section className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-3 px-1">
        <Text
          variant="caption"
          className="text-gold uppercase font-bold tracking-widest opacity-80"
        >
          {COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.SUB_SECTIONS.PENDING}
        </Text>
        <Badge variant="gold" isPulse>
          {total}
        </Badge>
        <div className="h-px flex-1 bg-gold/10 ml-4" />
      </div>

      <div className="space-y-8">
        {[
          {
            label:
              COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.SUB_SECTIONS
                .MY_SUBMISSIONS,
            data: myPending,
            border: 'border-gold/20 shadow-gold/5',
          },
          {
            label:
              COMPETITION_UI.DETAIL.SECTIONS.ACTIONS.SUB_SECTIONS
                .OTHER_SUBMISSIONS,
            data: othersPending,
            border: 'border-white/5',
          },
        ].map(
          (section) =>
            section.data.length > 0 && (
              <div key={section.label} className="space-y-3">
                <Text
                  variant="micro"
                  className="ml-4 opacity-40 uppercase font-black italic"
                >
                  {section.label}
                </Text>
                <Card
                  variant="dark"
                  className={cn(
                    'overflow-hidden divide-y divide-white/5',
                    section.border,
                  )}
                >
                  {section.data.map((action: any) => (
                    <ActionRow
                      key={action.id}
                      action={action}
                      onUpdate={onUpdate}
                      onStatusChange={onStatusChange}
                    />
                  ))}
                </Card>
              </div>
            ),
        )}
      </div>
    </section>
  );
};
