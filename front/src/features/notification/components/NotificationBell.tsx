import {
  Card,
  CARD_VARIANT,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  ICONS,
  cn,
  List,
  Row,
  formatShortDate,
} from '@/shared';
import { useNotificationBellUI } from '@/features/notification/hooks';
import { NOTIFICATION } from '@/features/notification/constants';

export const NotificationBell = () => {
  const {
    isOpen,
    toggleBell,
    containerRef,
    notifications,
    unreadCount,
    handleNotificationClick,
  } = useNotificationBellUI();

  return (
    <div className="relative" ref={containerRef}>
      {/* BOUTON CLOCHE */}
      <button
        type="button"
        onClick={toggleBell}
        className="relative p-2 rounded-full hover:bg-surface-base transition-default focus:outline-none focus:ring-2 focus:ring-gold-border cursor-pointer"
        aria-label={`Notifications, ${unreadCount} non lues`}
      >
        <span className="text-xl" aria-hidden="true">
          {ICONS.NOTIFICATION}
        </span>

        {/* Pastille Rouge dynamique */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-danger-bright text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-dark animate-pulse-subtle">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <Card
          variant={CARD_VARIANT.DARK}
          padding="none"
          radius="xl"
          className="absolute top-full right-0 mt-2 w-80 max-h-[80vh] sm:w-96 bg-dark-lighter shadow-2xl border-gold-border z-50 flex flex-col overflow-hidden animate-slide-up"
        >
          <Card.Header className="py-3 px-4 justify-center">
            <Text
              variant={TEXT_VARIANT.H3}
              colorTheme={TEXT_THEME.GOLD}
              className="italic"
            >
              {NOTIFICATION.TITLE}
            </Text>
          </Card.Header>

          <List className="overflow-y-auto custom-scrollbar flex-1 max-h-96">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Text
                  variant={TEXT_VARIANT.MICRO}
                  colorTheme={TEXT_THEME.DIMMED}
                >
                  {NOTIFICATION.EMPTY}
                </Text>
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={cn(
                    'w-full text-left p-4 hover:bg-surface-base transition-default cursor-pointer focus:outline-none border-b border-border-subtle last:border-0',
                    !notif.is_read ? 'bg-gold-soft' : 'opacity-70',
                  )}
                >
                  <Row justify="between" align="start" gap="sm">
                    <Text
                      variant={TEXT_VARIANT.BODY}
                      className={cn(
                        'text-sm',
                        !notif.is_read
                          ? 'font-bold text-silver'
                          : 'text-text-muted',
                      )}
                    >
                      {notif.title}
                    </Text>
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1" />
                    )}
                  </Row>
                  <Text
                    variant={TEXT_VARIANT.BODY}
                    colorTheme={TEXT_THEME.MUTED}
                    className={cn(
                      'mt-1 normal-case tracking-normal line-clamp-2',
                      !notif.is_read ? 'font-bold' : '',
                    )}
                  >
                    {notif.message}
                  </Text>
                  <Text
                    variant={TEXT_VARIANT.MICRO}
                    colorTheme={TEXT_THEME.DIMMED}
                    className="mt-2 block italic text-[8px]"
                  >
                    {formatShortDate(notif.created_at)}
                  </Text>
                </button>
              ))
            )}
          </List>
        </Card>
      )}
    </div>
  );
};
