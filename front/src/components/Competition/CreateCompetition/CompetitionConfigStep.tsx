import { Input, Button, Text, Card } from '@/components/UI';
import { FORM, ICONS, BUTTONS } from '@/constants';
import type { CompetitionFormData } from '@/types';
import { cn } from '@/utils';

interface ConfigStepProps {
  formData: CompetitionFormData;
  updateField: <K extends keyof CompetitionFormData>(
    field: K,
    value: CompetitionFormData[K],
  ) => void;
  handleJoinCodeChange: (e: any) => void;
  onNext: () => void;
  onGenerateCode: () => void;
  canNext: boolean;
}

export const CompetitionConfigStep = ({
  formData,
  updateField,
  handleJoinCodeChange,
  onGenerateCode,
  onNext,
  canNext,
}: ConfigStepProps) => {
  const toggles = [
    {
      id: 'fogOfWar',
      label: FORM.COMPETITION.LABELS.FOG_OF_WAR,
      sub: FORM.COMPETITION.HINTS.FOG_OF_WAR,
      active: formData.fogOfWar,
    },
    {
      id: 'participate',
      label: FORM.COMPETITION.LABELS.PARTICIPATE,
      sub: FORM.COMPETITION.HINTS.PARTICIPATE,
      active: formData.participate,
    },
  ] as const;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center space-y-1">
        <Text variant="h2" className="italic">
          {FORM.COMPETITION.STEPS.CONFIG.TITLE}
        </Text>
        <Text variant="caption" className="opacity-30">
          {FORM.COMPETITION.STEPS.CONFIG.SUBTITLE}
        </Text>
      </div>

      <div className="space-y-4">
        <Input
          label={FORM.COMPETITION.LABELS.NAME}
          placeholder={FORM.COMPETITION.PLACEHOLDERS.NAME}
          value={formData.name}
          onChange={(e: any) => updateField('name', e.target.value)}
          required
          align="center"
        />
        <div className="space-y-1">
          <div className="relative flex items-center group">
            <Input
              label={FORM.COMPETITION.LABELS.JOIN_CODE}
              value={formData.joinCode ?? ''}
              onChange={handleJoinCodeChange}
              align="center"
              placeholder={FORM.COMPETITION.PLACEHOLDERS.JOIN_CODE}
              renderRight={
                <button
                  type="button"
                  onClick={onGenerateCode}
                  className={cn(
                    'flex items-center gap-2 py-1 px-2 rounded-lg',
                    'bg-gold/5 border border-gold/10',
                    'text-gold/60 hover:text-gold transition-all active:scale-95',
                  )}
                >
                  <span className="text-xs font-bold uppercase tracking-tighter">
                    {BUTTONS.AUTO}
                  </span>
                  <span className="text-sm">{ICONS.STARS}</span>
                </button>
              }
            />
          </div>
          {!formData.joinCode && (
            <Text
              variant="micro"
              className="italic opacity-30 text-center block"
            >
              {FORM.COMPETITION.HINTS.JOIN_CODE}
            </Text>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BLOC DÉBUT */}
          <div className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
            <Text
              variant="caption"
              className="text-gold tracking-widest uppercase pl-1"
            >
              {FORM.COMPETITION.LABELS.START}
            </Text>

            <Input
              type="date"
              value={formData.startDate}
              onChange={(e: any) => updateField('startDate', e.target.value)}
              required
            />

            <Card
              variant="dark"
              role="switch"
              aria-checked={formData.startFullDay}
              onClick={() =>
                updateField('startFullDay', !formData.startFullDay)
              }
              className="flex items-center justify-between py-2 px-3 group cursor-pointer transition-default border-transparent bg-transparent shadow-none"
            >
              <Text
                variant="micro"
                className={
                  formData.startFullDay ? 'text-white' : 'text-white/50'
                }
              >
                {FORM.COMPETITION.LABELS.FULL_DAY}
              </Text>
              <div
                className={cn(
                  'w-8 h-4 rounded-full relative transition-default',
                  formData.startFullDay ? 'bg-gold' : 'bg-white/10',
                )}
              >
                <div
                  className={cn(
                    'absolute top-0.5 w-3 h-3 bg-dark rounded-full transition-default',
                    formData.startFullDay ? 'left-4.5' : 'left-0.5',
                  )}
                />
              </div>
            </Card>

            {!formData.startFullDay && (
              <div className="animate-slide-down">
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e: any) =>
                    updateField('startTime', e.target.value)
                  }
                />
              </div>
            )}
          </div>

          {/* BLOC FIN */}
          <div className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
            <Text
              variant="caption"
              className="text-gold tracking-widest uppercase pl-1"
            >
              {FORM.COMPETITION.LABELS.END}
            </Text>

            <Input
              type="date"
              value={formData.endDate}
              onChange={(e: any) => updateField('endDate', e.target.value)}
            />

            <Card
              variant="dark"
              role="switch"
              aria-checked={formData.endFullDay}
              onClick={() => updateField('endFullDay', !formData.endFullDay)}
              className="flex items-center justify-between py-2 px-3 group cursor-pointer transition-default border-transparent bg-transparent shadow-none"
            >
              <Text
                variant="micro"
                className={formData.endFullDay ? 'text-white' : 'text-white/50'}
              >
                {FORM.COMPETITION.LABELS.FULL_DAY}
              </Text>
              <div
                className={cn(
                  'w-8 h-4 rounded-full relative transition-default',
                  formData.endFullDay ? 'bg-gold' : 'bg-white/10',
                )}
              >
                <div
                  className={cn(
                    'absolute top-0.5 w-3 h-3 bg-dark rounded-full transition-default',
                    formData.endFullDay ? 'left-4.5' : 'left-0.5',
                  )}
                />
              </div>
            </Card>

            {!formData.endFullDay && (
              <div className="animate-slide-down">
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e: any) => updateField('endTime', e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {toggles.map((toggle) => (
            <Card
              key={toggle.id}
              variant="dark"
              role="switch"
              aria-checked={toggle.active}
              aria-label={toggle.label}
              onClick={() => updateField(toggle.id, !toggle.active)}
              className={cn(
                'flex items-center justify-between py-3 px-4 group cursor-pointer transition-default',
                'hover:border-gold/30 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none',
                toggle.active ? 'border-gold/30' : 'border-white/5',
              )}
            >
              <div className="flex flex-col text-left">
                <Text
                  variant="caption"
                  className={cn(
                    'transition-default',
                    toggle.active ? 'text-gold' : 'text-gold/50',
                  )}
                >
                  {toggle.label}
                </Text>
                <Text variant="micro" className="italic mt-1 opacity-20">
                  {toggle.sub}
                </Text>
              </div>
              <div
                aria-hidden="true"
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

      <Button fullWidth onClick={onNext} disabled={!canNext} size="lg">
        {BUTTONS.CONTINUE}
      </Button>
    </div>
  );
};
