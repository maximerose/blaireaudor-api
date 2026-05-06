import { Input, Button, Text, Card, Badge } from '@/components/UI';
import { cn } from '@/utils';
import { useEditCompetition } from '@/hooks';
import { FORM, BUTTONS, COMPETITION_UI } from '@/constants';

export const CompetitionGeneralSettings = ({ competition }: any) => {
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
          <Text variant="body" className="font-bold text-gold">
            {competition.name}
          </Text>
          <Text
            variant="micro"
            className="opacity-40 uppercase tracking-widest"
          >
            <span className="text-gold">{competition.join_code}</span> •
            {COMPETITION_UI.ADMIN.GENERAL.SETTINGS_LABEL}
          </Text>
        </div>
        <Button
          variant="ghost"
          size="sm"
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
          onChange={(e: any) => updateField('name', e.target.value)}
        />
        <Input
          label={FORM.COMPETITION.LABELS.JOIN_CODE}
          value={formData.joinCode ?? ''}
          onChange={(e: any) =>
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
          <Text
            variant="caption"
            className="text-gold tracking-widest uppercase pl-1"
          >
            {FORM.COMPETITION.LABELS.START}
          </Text>
          {competition.has_started && (
            <Badge variant="ghost" className="text-[8px] ml-2">
              {FORM.COMPETITION.HINTS.ALREADY_STARTED}
            </Badge>
          )}
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e: any) => updateField('startDate', e.target.value)}
            disabled={competition.has_started}
          />
          <Card
            variant="dark"
            onClick={() => updateField('startFullDay', !formData.startFullDay)}
            className={cn(
              'flex items-center justify-between py-2 px-3 cursor-pointer bg-transparent border-transparent shadow-none',
              !competition.has_started
                ? 'cursor-pointer'
                : 'cursor-not-allowed',
            )}
          >
            <Text
              variant="micro"
              className={formData.startFullDay ? 'text-white' : 'text-white/50'}
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
            <Input
              type="time"
              value={formData.startTime}
              onChange={(e: any) => updateField('startTime', e.target.value)}
              disabled={competition.has_started}
            />
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
            onClick={() => updateField('endFullDay', !formData.endFullDay)}
            className="flex items-center justify-between py-2 px-3 cursor-pointer bg-transparent border-transparent shadow-none"
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
            <Input
              type="time"
              value={formData.endTime}
              onChange={(e: any) => updateField('endTime', e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
        <Button variant="ghost" onClick={() => setIsEditing(false)}>
          {BUTTONS.CANCEL}
        </Button>
        <Button onClick={() => handleSave()} isLoading={loading}>
          {BUTTONS.SAVE}
        </Button>
      </div>
    </div>
  );
};
