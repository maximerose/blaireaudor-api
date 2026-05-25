import {
  Card,
  CARD_VARIANT,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  Input,
  Button,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  Alert,
  Stack,
  List,
  Row,
  ICONS,
  BUTTONS,
} from '@/shared';
import { COMPETITION_UI } from '@/features/competition/constants';
import { useMergePlayers } from '@/features/competition/admin/hooks';

interface MergePlayersModalProps {
  competitionId: string;
  competitionCode: string;
  guestPlayer: { id: string; display_name: string; actions_count: number };
  onClose: () => void;
}

export const MergePlayersModal = (props: MergePlayersModalProps) => {
  const { guestPlayer, onClose, competitionId, competitionCode } = props;

  const {
    search,
    setSearch,
    users,
    isFetching,
    selectedUser,
    setSelectedUser,
    dropdownRef,
    isPending,
    handleConfirm,
    handleSelectUser,
  } = useMergePlayers({
    competitionId,
    competitionCode,
    guestPlayerId: guestPlayer.id,
    onClose,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-md animate-fade-in"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <Card
          variant={CARD_VARIANT.DARK}
          className="border-gold-border shadow-modal-gold"
        >
          <Card.Body p="lg" gap="md">
            <Stack gap="none" className="text-center">
              <Text variant={TEXT_VARIANT.H2} colorTheme={TEXT_THEME.GOLD}>
                {COMPETITION_UI.ADMIN.MERGE.TITLE}
              </Text>
              <Text
                variant={TEXT_VARIANT.BODY}
                colorTheme={TEXT_THEME.MUTED}
                className="text-xs mt-1"
              >
                {COMPETITION_UI.ADMIN.MERGE.SUBTITLE(guestPlayer.display_name)}
              </Text>
            </Stack>

            <Alert variant="warning">
              {COMPETITION_UI.ADMIN.MERGE.ALERT_WARNING(
                guestPlayer.actions_count,
              )}
            </Alert>

            <div className="relative w-full" ref={dropdownRef}>
              <Input
                label={COMPETITION_UI.ADMIN.MERGE.INPUT_LABEL}
                placeholder={COMPETITION_UI.ADMIN.MERGE.INPUT_PLACEHOLDER}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedUser(null);
                }}
                icon={isFetching ? ICONS.LOADING : ICONS.SEARCH}
                autoComplete="off"
              />

              {users.length > 0 && !selectedUser && (
                <Card
                  variant={CARD_VARIANT.DARK}
                  padding="none"
                  className="absolute top-full left-0 right-0 mt-1 z-50 max-h-48 overflow-y-auto bg-dark border-gold-border shadow-2xl"
                >
                  <List>
                    {users.map((u: any) => (
                      <button
                        key={u.id}
                        type="button"
                        className="w-full px-4 py-2.5 text-left hover:bg-surface-base text-xs flex flex-col cursor-pointer border-b border-border-subtle"
                        onClick={() => handleSelectUser(u)}
                      >
                        <span className="font-bold text-silver">
                          {u.player?.display_name || u.username}
                        </span>
                        <span className="text-text-dimmed text-[10px]">
                          @{u.username} • {u.email}
                        </span>
                      </button>
                    ))}
                  </List>
                </Card>
              )}
            </div>

            <Row gap="sm" className="pt-2">
              <Button
                variant={BUTTON_VARIANT.GHOST_NEUTRAL}
                size={BUTTON_SIZE.SMALL}
                className="flex-1"
                onClick={onClose}
                disabled={isPending}
              >
                {BUTTONS.CANCEL}
              </Button>
              <Button
                variant={BUTTON_VARIANT.PRIMARY}
                size={BUTTON_SIZE.SMALL}
                className="flex-1 border-gold"
                onClick={handleConfirm}
                isLoading={isPending}
                disabled={!selectedUser || isPending}
              >
                {COMPETITION_UI.ADMIN.MERGE.SUBMIT_BUTTON}
              </Button>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};
