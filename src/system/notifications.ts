export type NotificationLevel = "info" | "warning" | "critical";

export type SystemNotification = {
  id: string;
  source: string;
  level: NotificationLevel;
  message: string;
  timestamp: number;
};

const notifications: SystemNotification[] = [];

export function pushNotification(n: SystemNotification) {
  notifications.push(n);
}

export function getNotifications() {
  return notifications;
}
