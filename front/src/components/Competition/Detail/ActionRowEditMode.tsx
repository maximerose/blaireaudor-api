import { Input, Button } from '@/components/UI';

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
          label="Description du méfait"
          placeholder="Ex: A mangé le dernier cookie..."
          value={editData.description}
          onChange={(e: any) =>
            setEditData({ ...editData, description: e.target.value })
          }
        />
      </div>

      {/* Input Points */}
      <div className="md:col-span-3">
        <Input
          label="Points"
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
        Annuler
      </Button>
      <Button size="sm" variant="primary" onClick={onSave} type="button">
        Enregistrer les modifs 💾
      </Button>
    </div>
  </div>
);
