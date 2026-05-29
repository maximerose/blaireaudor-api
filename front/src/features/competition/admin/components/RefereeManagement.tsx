import { useAuthContext } from '@/features/account/context/AuthContext';
import { useRefereeManagementUI } from '@/features/competition/admin/hooks';
import { COMPETITION_UI } from '@/features/competition/constants';
import { useCompetitionContext } from '@/features/competition/context';
import { PlayerSearchField } from '@/features/competition/fields';
import { usePermissions } from '@/features/competition/hooks';
import { type RefereeListItem } from '@/features/player';
import {
  Badge,
  BADGE_VARIANT,
  ICONS,
  Row,
  SectionHeader,
  Stack,
  Text,
  TEXT_THEME,
  TEXT_VARIANT,
  UI,
} from '@/shared';

export const RefereeManagement = () => {
  const { competition } = useCompetitionContext();
  const { user } = useAuthContext();
  const { roles } = usePermissions();

  const {
    referees,
    isLastRef,
    loadingAction,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    handleAdd,
    handleRemoveRequest,
  } = useRefereeManagementUI(competition);

  const isGlobalLoading =
    loadingAction !== null && loadingAction.startsWith('add');

  return (
    <Stack gap="md" className="pt-6 border-t border-border-subtle w-full">
      <SectionHeader
        title={COMPETITION_UI.ADMIN.REFEREE.TITLE}
        subtitle={COMPETITION_UI.ADMIN.REFEREE.SUBTITLE}
        centered
      />

      <Row wrap justify="center" gap="sm" className="w-full">
        {referees.map((ref: RefereeListItem) => {
          const isCreator = ref.userId === competition.created_by?.id;
          const isMe = user?.player?.id === ref.id;

          const variant = isCreator
            ? BADGE_VARIANT.CREATOR
            : isMe
              ? BADGE_VARIANT.ME
              : BADGE_VARIANT.REFEREE;
          const icon = isCreator ? ICONS.CREATOR : ICONS.REFEREE;

          const isRemoving = loadingAction === `remove-${ref.id}`;
          const canRemove = (!isLastRef && isMe) || (roles.isCreator && !isMe);

          return (
            <Badge
              key={ref.id}
              variant={variant}
              icon={icon}
              className={isRemoving ? 'opacity-50 pointer-events-none' : ''}
              onRemove={
                canRemove ? () => handleRemoveRequest(ref, isMe) : undefined
              }
              removeLabel={
                isMe
                  ? COMPETITION_UI.ADMIN.REFEREE.TOOLTIP_RESIGN
                  : COMPETITION_UI.ADMIN.REFEREE.TOOLTIP_REVOKE
              }
            >
              {ref.name}
              {isMe && <span className="opacity-70 ml-1">({UI.ME})</span>}
            </Badge>
          );
        })}
      </Row>

      {isLastRef && (
        <Text
          variant={TEXT_VARIANT.MICRO}
          colorTheme={TEXT_THEME.WARNING}
          className="italic block text-center animate-fade-in"
        >
          {COMPETITION_UI.ADMIN.REFEREE.LAST_REF_WARNING}
        </Text>
      )}

      <Row justify="center" className="w-full pt-2">
        <div className="w-full sm:max-w-md">
          <PlayerSearchField
            searchTerm={searchQuery}
            setSearchTerm={setSearchQuery}
            isSearching={isSearching}
            results={searchResults}
            onSelect={handleAdd}
            disabled={isGlobalLoading}
          />
        </div>
      </Row>
    </Stack>
  );
};
