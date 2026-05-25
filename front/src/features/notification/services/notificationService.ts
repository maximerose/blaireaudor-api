import { API, apiFetch } from '@/shared';
import type { NotificationItem } from '@/features/notification/types';

export const notificationService = {
  getAll: async (signal?: AbortSignal): Promise<NotificationItem[]> => {
    const response = await apiFetch(API.ENDPOINTS.NOTIFICATIONS.BASE, {
      signal,
    });
    const data = await response.json();
    return data['hydra:member'] || data.member || [];
  },

  markAsRead: async (id: string): Promise<NotificationItem> => {
    const response = await apiFetch(API.ENDPOINTS.NOTIFICATIONS.DETAIL(id), {
      method: 'PATCH',
      headers: { 'Content-Type': API.GROUPS.MERGE_PATCH },
      body: JSON.stringify({ is_read: true }),
    });
    return response.json();
  },
};
