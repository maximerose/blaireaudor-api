import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/features/account';
import { QUERY_KEYS } from '@/shared';
import { notificationService } from '@/features/notification/services';
import type { NotificationItem } from '@/features/notification/types';

export const useNotifications = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [isMercureConnected, setIsMercureConnected] = useState(false);

  // 1. Écouteur Temps Réel (Mercure SSE)
  useEffect(() => {
    if (!user?.id) return;

    const topic = encodeURIComponent(
      `urn:blaireau:user:${user.id}:notifications`,
    );
    const hubUrl = new URL(
      import.meta.env.VITE_MERCURE_PUBLIC_URL ||
        'http://localhost/.well-known/mercure',
    );
    hubUrl.searchParams.append('topic', topic);

    const eventSource = new EventSource(hubUrl.toString(), {
      withCredentials: true,
    });

    eventSource.onopen = () => setIsMercureConnected(true);

    eventSource.onerror = () => {
      // En cas d'échec (ex: perte de co, ou manque de cookie JWT Mercure), on passe au polling
      setIsMercureConnected(false);
    };

    eventSource.onmessage = (event) => {
      const newNotification: NotificationItem = JSON.parse(event.data);

      // Injection directe dans le cache au-dessus des anciennes !
      queryClient.setQueryData(
        QUERY_KEYS.notifications.all,
        (old: NotificationItem[] | undefined) => {
          if (!old) return [newNotification];
          return [newNotification, ...old];
        },
      );

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.competition.all });
    };

    return () => eventSource.close();
  }, [user?.id, queryClient]);

  // 2. React Query (Fetch initial + Polling de Secours)
  const query = useQuery({
    queryKey: QUERY_KEYS.notifications.all,
    queryFn: ({ signal }) => notificationService.getAll(signal),
    enabled: !!user,
    // La magie du Fallback : Polling 30s UNIQUEMENT si Mercure est KO
    refetchInterval: isMercureConnected ? false : 30000,
  });

  // 3. Mutation pour marquer comme lu
  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.notifications.all,
      });
      const previous = queryClient.getQueryData<NotificationItem[]>(
        QUERY_KEYS.notifications.all,
      );

      queryClient.setQueryData(
        QUERY_KEYS.notifications.all,
        (old: NotificationItem[] | undefined) =>
          old?.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          QUERY_KEYS.notifications.all,
          context.previous,
        );
      }
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const currentNotifs = queryClient.getQueryData<NotificationItem[]>(
        QUERY_KEYS.notifications.all,
      );
      const unreadIds =
        currentNotifs?.filter((n) => !n.is_read).map((n) => n.id) || [];

      if (unreadIds.length === 0) return;

      queryClient.setQueryData(
        QUERY_KEYS.notifications.all,
        (old: NotificationItem[] | undefined) =>
          old?.map((n) => ({ ...n, is_read: true })),
      );

      await Promise.all(
        unreadIds.map((id) => notificationService.markAsRead(id)),
      );
    },
  });

  const unreadCount = query.data?.filter((n) => !n.is_read).length || 0;

  return {
    notifications: query.data || [],
    unreadCount,
    isLoading: query.isLoading,
    isMercureConnected,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
  };
};
