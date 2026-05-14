import {
  Input,
  Button,
  Text,
  Card,
  Badge,
  Switch,
  BADGE_VARIANT,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  TEXT_VARIANT,
  CARD_VARIANT,
  Label,
} from '@/components/UI';
import { cn } from '@/utils';
import { useEditCompetition } from '@/hooks';
import { FORM, BUTTONS, COMPETITION_UI } from '@/constants';
import { useCompetitionContext } from '@/context';

export const CompetitionGeneralSettings = () => {
  const { competition } = useCompetitionContext();
  const {
    isEditing,
    setIsEditing,
    formData,
    updateField,
    handleSave,
    loading,
  } = useEditCompetition(competition);

  if (!isEditing) {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-gold/20 transition-all">
        <div className="text-center sm:text-left">
          <Text variant={TEXT_VARIANT.BODY} className="font-bold text-gold">
            {competition.name}
          </Text>
          <Text
            variant={TEXT_VARIANT.MICRO}
            className="opacity-40 uppercase tracking-widest"
          >
            <span className="text-gold">{competition.join_code}</span> •{' '}
            {COMPETITION_UI.ADMIN.GENERAL.SETTINGS_LABEL}
          </Text>
        </div>
        <Button
          variant={BUTTON_VARIANT.GHOST}
          size={BUTTON_SIZE.SMALL}
          onClick={() => setIsEditing(true)}
          className="mt-3 sm:mt-0"
        >
          {COMPETITION_UI.ADMIN.GENERAL.BUTTON_EDIT}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-black/20 rounded-3xl border border-gold/20 animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={FORM.COMPETITION.LABELS.NAME}
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
        />
        <Input
          label={FORM.COMPETITION.LABELS.JOIN_CODE}
          value={formData.joinCode ?? ''}
          onChange={(e) =>
            updateField('joinCode', e.target.value.toUpperCase())
          }
        />

        <div
          className={cn(
            'space-y-3 p-4 border rounded-2xl transition-all',
            competition.has_started
              ? 'bg-white/2 border-white/5 opacity-60'
              : 'bg-white/5 border-white/10',
          )}
        >
          <Label>
            {FORM.COMPETITION.LABELS.START}
            {competition.has_started && (
              <Badge variant={BADGE_VARIANT.GHOST} className="text-[8px] ml-2">
                {FORM.COMPETITION.HINTS.ALREADY_STARTED}
              </Badge>
            )}
          </Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => updateField('startDate', e.target.value)}
            disabled={competition.has_started}
          />
          <Card
            variant={CARD_VARIANT.DARK}
            onClick={() =>
              !competition.has_started &&
              updateField('startFullDay', !formData.startFullDay)
            }
            className={cn(
              'flex items-center justify-between py-2 px-3 cursor-pointer bg-transparent border-transparent shadow-none',
              !competition.has_started
                ? 'cursor-pointer'
                : 'cursor-not-allowed',
            )}
          >
            <Text
              variant={TEXT_VARIANT.MICRO}
              className={formData.startFullDay ? 'text-white' : 'text-white/50'}
            >
              {FORM.COMPETITION.LABELS.FULL_DAY}
            </Text>
            <Switch checked={formData.startFullDay} onChange={() => {}} />
          </Card>
          {!formData.startFullDay && (
            <Input
              type="time"
              value={formData.startTime}
              onChange={(e) => updateField('startTime', e.target.value)}
              disabled={competition.has_started}
            />
          )}
        </div>

        {/* BLOC FIN */}
        <div className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <Label>{FORM.COMPETITION.LABELS.END}</Label>
          <Input
            type="date"
            min={formData.startDate}
            value={formData.endDate}
            onChange={(e) => updateField('endDate', e.target.value)}
          />
          <Card
            variant={CARD_VARIANT.DARK}
            onClick={() => updateField('endFullDay', !formData.endFullDay)}
            className="flex items-center justify-between py-2 px-3 cursor-pointer bg-transparent border-transparent shadow-none"
          >
            <Text
              variant={TEXT_VARIANT.MICRO}
              className={formData.endFullDay ? 'text-white' : 'text-white/50'}
            >
              {FORM.COMPETITION.LABELS.FULL_DAY}
            </Text>
            <Switch checked={formData.endFullDay} onChange={() => {}} />
          </Card>
          {!formData.endFullDay && (
            <Input
              type="time"
              value={formData.endTime}
              onChange={(e) => updateField('endTime', e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
        <Button
          variant={BUTTON_VARIANT.GHOST}
          onClick={() => setIsEditing(false)}
        >
          {BUTTONS.CANCEL}
        </Button>
        <Button onClick={() => handleSave()} isLoading={loading}>
          {BUTTONS.SAVE}
        </Button>
      </div>
    </div>
  );
};
