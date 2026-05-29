// front/src/features/notification/components/NotificationBell.tsx

import {
  DEFAULT_NOTIFICATION_STYLE,
  NOTIFICATION,
  NOTIFICATION_TYPE_CONFIG,
} from '@/features/notification/constants/notification';
import { useNotificationBellUI } from '@/features/notification/hooks';
import {
  Card,
  CARD_VARIANT,
  cn,
  formatRelativeTime,
  ICONS,
  List,
  Row,
  Text,
  TEXT_THEME,
  TEXT_VARIANT,
} from '@/shared';

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
      {/* ... Le bouton cloche reste 100% identique ... */}
      <button
        type="button"
        onClick={toggleBell}
        className="relative p-2 rounded-full hover:bg-surface-base transition-default focus:outline-none focus:ring-2 focus:ring-gold-border cursor-pointer"
        aria-label={`Notifications, ${unreadCount} non lues`}
      >
        <span
          className={cn(
            'text-xl block',
            unreadCount > 0 ? 'text-danger-bright' : 'text-text-base',
          )}
          aria-hidden="true"
        >
          {unreadCount > 0 ? ICONS.NOTIFICATION_ON : ICONS.NOTIFICATION}
        </span>

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-danger-bright text-white text-xs font-black rounded-full flex items-center justify-center border-2 border-dark animate-pulse-subtle">
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
          className={cn(
            'fixed top-16 left-4 right-4 w-auto max-h-[80vh] flex flex-col overflow-hidden z-50 shadow-2xl border-gold-border animate-slide-up bg-dark-lighter',
            'sm:absolute sm:top-full sm:right-0 sm:left-auto sm:w-85 mt-2',
          )}
        >
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
              notifications.map((notif) => {
                // 🟢 Récupération du style d'icône
                const styleConfig =
                  NOTIFICATION_TYPE_CONFIG[notif.type] ||
                  DEFAULT_NOTIFICATION_STYLE;

                return (
                  <button
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={cn(
                      'w-full text-left p-3 hover:bg-surface-base transition-default focus:outline-none border-b border-border-subtle last:border-0',
                      'flex flex-row items-start gap-3', // 🟢 Alignement en ligne pour l'avatar compact
                      !notif.is_read ? 'bg-gold-soft/5' : 'bg-transparent',
                    )}
                  >
                    {/* 🟢 COMPACT AVATAR DE GAUCHE */}
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 border border-white/5 shadow-inner',
                        styleConfig.wrapperClass,
                      )}
                      aria-hidden="true"
                    >
                      {styleConfig.icon}
                    </div>

                    {/* 🥞 BLOC TEXTUEL DE DROITE */}
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <Row justify="between" align="start" gap="sm">
                        <Text
                          variant={TEXT_VARIANT.BODY}
                          className={cn(
                            'text-xs normal-case leading-tight flex-1 min-w-0 truncate',
                            !notif.is_read
                              ? 'font-black text-gold'
                              : 'text-silver/60',
                          )}
                        >
                          {notif.title}
                        </Text>
                        {!notif.is_read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5 shadow-[0_0_6px_var(--color-gold)]" />
                        )}
                      </Row>

                      <Text
                        variant={TEXT_VARIANT.BODY}
                        colorTheme={TEXT_THEME.MUTED}
                        className={cn(
                          'text-xs normal-case tracking-normal line-clamp-2 leading-snug',
                          notif.is_read && 'font-normal opacity-50',
                        )}
                      >
                        {notif.message}
                      </Text>

                      <Text
                        variant={TEXT_VARIANT.MICRO}
                        colorTheme={TEXT_THEME.INFO}
                        className={cn(
                          'mt-0.5 block text-[10px] normal-case tracking-normal',
                          notif.is_read
                            ? 'opacity-50 font-normal'
                            : 'font-bold',
                        )}
                      >
                        {formatRelativeTime(notif.created_at)}
                      </Text>
                    </div>
                  </button>
                );
              })
            )}
          </List>
        </Card>
      )}
    </div>
  );
};
