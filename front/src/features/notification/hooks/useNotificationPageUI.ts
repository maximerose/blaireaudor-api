import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NotificationItem } from '../types';
import { useNotifications } from './useNotifications';

export const useNotificationPageUI = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  // Marque automatiquement tout comme lu lorsque l'utilisateur consulte la page active
  useEffect(() => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
  }, [unreadCount, markAllAsRead]);

  /**
   * Gère le clic sur une ligne de notification :
   * Passe l'état à lu si nécessaire, puis redirige vers l'arène cible.
   */
  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    if (notification.target_url) {
      navigate(notification.target_url);
    }
  };

  return {
    notifications,
    hasUnread: unreadCount > 0,
    handleNotificationClick,
    markAllAsRead,
  };
};
