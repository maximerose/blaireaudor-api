import { Input, Button, BUTTON_VARIANT } from '@/components/UI';
import { FORM, BUTTONS } from '@/constants';
import {
  useActionRowInteraction,
  useCompetition,
  useCompetitionAdmin,
} from '@/hooks';
import type { Action } from '@/types';

interface ActionRowEditModeProps {
  action: Action;
  onCancel: () => void;
}

export const ActionRowEditMode = ({
  action,
  onCancel,
}: ActionRowEditModeProps) => {
  const { isAdmin } = useCompetition();
  const { handleUpdate } = useCompetitionAdmin();

  const { editData, setEditData, handleSave } = useActionRowInteraction(
    action,
    handleUpdate,
  );

  const onInternalSave = async () => {
    const success = await handleSave(isAdmin);
    if (success) onCancel();
  };

  return (
    <div className="p-6 bg-gold/10 border-y border-gold/20 animate-fade-in space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Input Description */}
        <div className="md:col-span-9">
          <Input
            label={FORM.REPORT_ACTION.LABELS.DESCRIPTION}
            placeholder={FORM.REPORT_ACTION.PLACEHOLDERS.DESCRIPTION}
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
          />
        </div>

        {/* Input Points */}
        <div className="md:col-span-3">
          <Input
            label={FORM.REPORT_ACTION.LABELS.POINTS}
            type="number"
            value={editData.points}
            onChange={(e) =>
              setEditData({ ...editData, points: Number(e.target.value) })
            }
          />
        </div>
      </div>

      {/* Actions du formulaire */}
      <div className="flex gap-2 pt-2">
        <Button
          className="flex-1"
          variant={BUTTON_VARIANT.GHOST}
          onClick={onCancel}
          type="button"
        >
          {BUTTONS.CANCEL}
        </Button>
        <Button
          className="flex-1"
          variant={BUTTON_VARIANT.PRIMARY}
          onClick={onInternalSave}
          type="button"
        >
          {BUTTONS.SAVE}
        </Button>
      </div>
    </div>
  );
};
