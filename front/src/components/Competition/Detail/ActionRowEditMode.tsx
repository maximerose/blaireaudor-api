import { Input, Button } from '@/components/UI';
import { FORM } from '@/constants';

interface ActionRowEditModeProps {
  editData: { description: string; points: number | string };
  setEditData: (data: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ActionRowEditMode = ({
  editData,
  setEditData,
  onSave,
  onCancel,
}: ActionRowEditModeProps) => (
  <div className="p-6 bg-gold/10 border-y border-gold/20 animate-fade-in space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Input Description */}
      <div className="md:col-span-9">
        <Input
          label={FORM.REPORT_ACTION.LABELS.DESCRIPTION}
          placeholder={FORM.REPORT_ACTION.PLACEHOLDERS.DESCRIPTION}
          value={editData.description}
          onChange={(e: any) =>
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
          onChange={(e: any) =>
            setEditData({ ...editData, points: e.target.value })
          }
        />
      </div>
    </div>

    {/* Actions du formulaire */}
    <div className="flex justify-end gap-2 pt-2">
      <Button size="sm" variant="ghost" onClick={onCancel} type="button">
        {FORM.SHARED.BUTTONS.CANCEL}
      </Button>
      <Button size="sm" variant="primary" onClick={onSave} type="button">
        {FORM.SHARED.BUTTONS.SAVE}
      </Button>
    </div>
  </div>
);
