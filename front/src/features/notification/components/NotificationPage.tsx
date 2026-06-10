import {
  cn,
  formatRelativeTime,
  ICONS,
  List,
  MainLayout,
  Row,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Stack,
  Text,
  TEXT_THEME,
  TEXT_VARIANT,
} from '@/shared';
import {
  DEFAULT_NOTIFICATION_STYLE,
  NOTIFICATION,
  NOTIFICATION_TYPE_CONFIG,
} from '../constants/notification';
import { useNotificationPageUI } from '../hooks/useNotificationPageUI';

export const NotificationPage = () => {
  const { notifications, hasUnread, handleNotificationClick, markAllAsRead } =
    useNotificationPageUI();

  return (
    <MainLayout title={NOTIFICATION.TITLE} subtitle={NOTIFICATION.TITLE}>
      <Stack gap="md" className="max-w-xl mx-auto w-full pb-16 md:pb-0">
        <Row justify="between" align="center" className="w-full px-1">
          <SectionHeader
            variant={SECTION_HEADER_VARIANT.TITLE}
            title={NOTIFICATION.TITLE}
          />
          {hasUnread && (
            <button
              type="button"
              onClick={() => markAllAsRead()}
              className="text-xs font-black uppercase text-gold/60 hover:text-gold transition-default focus:outline-none cursor-pointer"
              aria-label={NOTIFICATION.ARIA.MARK_ALL_READ}
            >
              <span className="text-sm">{ICONS.SUCCESS}</span>
              <span>{NOTIFICATION.MARK_ALL_READ}</span>
            </button>
          )}
        </Row>

        <div
          className={cn(
            'w-full bg-dark-lighter/30 border-y border-border-subtle/40 shadow-2xl',
            'max-sm:-mx-3 max-sm:w-[calc(100%+24px)] max-sm:border-x-0',
            'sm:rounded-2xl sm:border',
          )}
          role="region"
          aria-label={NOTIFICATION.ARIA.LIST}
        >
          <List>
            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <Text
                  variant={TEXT_VARIANT.BODY}
                  colorTheme={TEXT_THEME.DIMMED}
                  className="italic"
                >
                  {NOTIFICATION.EMPTY}
                </Text>
              </div>
            ) : (
              notifications.map((notif) => {
                // 🟢 Récupération dynamique du style de l'icône
                const styleConfig =
                  NOTIFICATION_TYPE_CONFIG[notif.type] ||
                  DEFAULT_NOTIFICATION_STYLE;

                return (
                  <button
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={cn(
                      'w-full text-left p-4 hover:bg-surface-base/30 transition-default focus:outline-none border-b border-border-subtle/30 last:border-0',
                      'flex flex-row items-center gap-4',
                      !notif.is_read ? 'bg-gold-soft/5' : 'bg-transparent',
                    )}
                    aria-label={`${!notif.is_read ? NOTIFICATION.ARIA.ITEM_UNREAD : NOTIFICATION.ARIA.ITEM_READ}${notif.title}`}
                  >
                    {/* AVATAR SÉMANTIQUE DE GAUCHE */}
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 border border-white/5 shadow-inner',
                        styleConfig.wrapperClass,
                      )}
                      aria-hidden="true"
                    >
                      {styleConfig.icon}
                    </div>

                    {/* BLOC TEXTUEL DE DROITE */}
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <Row justify="between" align="start" gap="sm">
                        <Text
                          variant={TEXT_VARIANT.H3}
                          className={cn(
                            'text-sm normal-case leading-tight',
                            !notif.is_read
                              ? 'font-black text-gold'
                              : 'text-silver/50',
                          )}
                        >
                          {notif.title}
                        </Text>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5 shadow-[0_0_6px_var(--color-gold)]" />
                        )}
                      </Row>

                      <Text
                        variant={TEXT_VARIANT.BODY}
                        colorTheme={TEXT_THEME.MUTED}
                        className={cn(
                          'text-sm normal-case tracking-normal leading-snug',
                          notif.is_read && 'opacity-40 font-normal',
                        )}
                      >
                        {notif.message}
                      </Text>

                      <Text
                        variant={TEXT_VARIANT.MICRO}
                        colorTheme={TEXT_THEME.INFO}
                        className={cn(
                          'mt-0 block font-bold text-[11px] normal-case tracking-normal',
                          notif.is_read && 'opacity-40 font-normal',
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
        </div>
      </Stack>
    </MainLayout>
  );
};

export default NotificationPage;
