import {
  Button,
  BUTTON_VARIANT,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  Stack,
} from '@/shared';
import { useAdminContext } from '@/features/competition/context';
import { COMPETITION_UI } from '@/features/competition/constants';

export const CloseCompetitionAction = () => {
  const { handleCloseCompetition, isUpdating, pendingCount } =
    useAdminContext();

  return (
    <Stack
      align="center"
      gap="sm"
      className="border-t md:border-t-0 border-border-subtle pt-6 md:pt-0 w-full"
    >
      <Text variant={TEXT_VARIANT.CAPTION} colorTheme={TEXT_THEME.MUTED}>
        {COMPETITION_UI.ADMIN.CLOSE.HEADER}
      </Text>

      <Button
        variant={BUTTON_VARIANT.DANGER}
        onClick={handleCloseCompetition}
        isLoading={isUpdating}
        disabled={pendingCount > 0}
        className="w-full sm:w-auto cursor-pointer"
      >
        {COMPETITION_UI.ADMIN.CLOSE.SUBMIT}
      </Button>

      {pendingCount > 0 && (
        <Text
          variant={TEXT_VARIANT.MICRO}
          colorTheme={TEXT_THEME.DANGER}
          className="animate-pulse text-center"
        >
          {COMPETITION_UI.ADMIN.CLOSE.PENDING_WARNING(pendingCount)}
        </Text>
      )}
    </Stack>
  );
};
