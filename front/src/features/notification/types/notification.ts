export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  target_url: string | null;
  created_at: string;
}
