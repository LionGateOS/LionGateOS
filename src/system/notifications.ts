import {
  pushNotification,
  getNotifications,
  type SystemNotification,
} from "./notificationCenter";

export type { SystemNotification };

export function notify(n: SystemNotification) {
  pushNotification(n);
}

export function listNotifications() {
  return getNotifications();
}
