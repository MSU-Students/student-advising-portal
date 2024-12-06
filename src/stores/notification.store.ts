import { defineStore } from 'pinia';
import { ILoggable } from 'src/entities';
export interface NotificationInfo {
  tag: string;
  title: string;
  body: string;
  badge?: string;
  log?: ILoggable;
  close?: VoidCallback;
}
interface INotificationState {
  notifications: NotificationInfo[];
}
export const useNotificationStore = defineStore('notification', {
  state: () =>
    ({
      notifications: [],
    } as INotificationState),
  actions: {
    async load() {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const list = await registration.getNotifications();
        this.notifications = list
          .map((n) => {
            n.onclose = () => {
              const index = this.notifications.findIndex(
                (notification) => n.tag == notification.tag
              );
              if (index >= 0) {
                this.notifications.splice(index, 1);
              }
            };
            return {
              close: () => n.close(),
              body: n.body,
              badge: n.icon,
              title: n.title,
              tag: n.tag,
              log: n.data as ILoggable,
            };
          })
          .sort((a, b) => b.log.date.localeCompare(a.log.date));
      }
    },
    newNotification(payload: NotificationInfo) {
      this.notifications.push(payload);
    },
    async closeNotification(payload: NotificationInfo) {
      const index = this.notifications.findIndex(
        (notification) => payload.tag == notification.tag
      );
      if (index >= 0) {
        this.notifications.splice(index, 1);
      }
      if (typeof payload.close == 'function') {
        payload.close();
        return;
      }
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const list = await registration.getNotifications({
          tag: payload.tag,
        });
        list.forEach((n) => n.close());
      }
    },
  },
});
