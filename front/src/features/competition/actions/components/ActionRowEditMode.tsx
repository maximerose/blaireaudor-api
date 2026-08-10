import { useActionRowInteraction } from '@/features/competition/actions/hooks';
import { useCompetitionAdmin } from '@/features/competition/admin';
import { useCompetitionContext } from '@/features/competition/context';
import type { Action } from '@/features/competition/types';
import {
  Button,
  BUTTON_VARIANT,
  BUTTONS,
  Grid,
  preventDefault,
  Row,
  Stack,
} from '@/shared';
import { ActionDescriptionField, ActionPointsField } from '../fields';

interface ActionRowEditModeProps {
  action: Action;
  onCancel: () => void;
}

export const ActionRowEditMode = ({
  action,
  onCancel,
}: ActionRowEditModeProps) => {
  const { isAdmin } = useCompetitionContext();
  const { handleUpdate, isUpdatingAction } = useCompetitionAdmin();

  const { editData, setEditData, handleSave } = useActionRowInteraction(
    action,
    handleUpdate,
  );

  const onInternalSave = async () => {
    const success = await handleSave(isAdmin);
    if (success) onCancel();
  };

  return (
    <Stack
      as="form"
      gap="md"
      onSubmit={preventDefault(onInternalSave)}
      className="p-6 bg-gold/10 border-y border-gold/20 animate-fade-in"
    >
      <Grid cols={1} md={12} gap="md" align="end">
        <div className="md:col-span-9">
          <ActionDescriptionField
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
          />
        </div>

        <div className="md:col-span-3">
          <ActionPointsField
            value={editData.points}
            onChange={(e) =>
              setEditData({ ...editData, points: Number(e.target.value) })
            }
          />
        </div>
      </Grid>

      <Row gap="sm" className="pt-2">
        <Button
          className="flex-1"
          variant={BUTTON_VARIANT.GHOST_NEUTRAL}
          onClick={onCancel}
          type="button"
          disabled={isUpdatingAction}
        >
          {BUTTONS.CANCEL}
        </Button>
        <Button
          className="flex-1"
          variant={BUTTON_VARIANT.PRIMARY}
          type="submit"
          isLoading={isUpdatingAction}
          disabled={isUpdatingAction}
        >
          {BUTTONS.SAVE}
        </Button>
      </Row>
    </Stack>
  );
};
