export type NotificationLevel = "info" | "warning" | "critical";

export type SystemNotification = {
  id: string;
  source: string;          // e.g., "smartquote", "travels", "system"
  level: NotificationLevel;
  message: string;
  timestamp: number;
  workspaceKey?: string;   // optional association to a workspace
};

type Subscriber = (list: SystemNotification[]) => void;

let notifications: SystemNotification[] = [];
const subscribers = new Set<Subscriber>();

export function pushNotification(n: SystemNotification) {
  notifications = [n, ...notifications].slice(0, 200); // cap history
  subscribers.forEach((fn) => fn(notifications));
}

export function getNotifications(): SystemNotification[] {
  return notifications;
}

export function subscribeNotifications(fn: Subscriber) {
  subscribers.add(fn);
  fn(notifications);
  return () => subscribers.delete(fn);
}

export function clearNotifications() {
  notifications = [];
  subscribers.forEach((fn) => fn(notifications));
}
