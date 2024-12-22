/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

declare const self: ServiceWorkerGlobalScope &
  typeof globalThis & { skipWaiting: () => void };

import { ILoggable, IProfile } from 'src/entities';
import { firebaseService } from 'src/services/firebase.service';
import { clientsClaim } from 'workbox-core';
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { translateLogToNotification } from 'src/notification.translator';

self.skipWaiting();
clientsClaim();

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

// Non-SSR fallback to index.html
// Production SSR fallback to offline.html (except for dev)
if (process.env.MODE !== 'ssr' || process.env.PROD) {
  registerRoute(
    new NavigationRoute(
      createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
      { denylist: [/sw\.js$/, /workbox-(.)*\.js$/] }
    )
  );
}

listenToNotification();
self.addEventListener('online', () => {
  firebaseService.authenticate();
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
      })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            client.postMessage({
              type: 'notificationClick',
              data: event.notification.data,
            });
            return client.focus();
          }
        }
        self.clients.openWindow('/').then((client) => {
          setTimeout(() => {
            if (client) {
              client.postMessage({
                type: 'notificationClick',
                data: event.notification.data,
              });
            }
          }, 1000);
        });
      })
  );
});
const sent: Record<string, boolean> = {};
async function listenToNotification() {
  if (Notification.permission == 'granted') {
    await firebaseService.authenticate();
    const user = firebaseService.auth();
    const profile =
      user && ((await firebaseService.get('profiles', user.uid)) as IProfile);

    const lastRead = undefined as ILoggable | undefined;
    const date = lastRead ? new Date(lastRead.date) : new Date();
    const pad = (n: number, l = 2) => String(n).padStart(l, '0');
    const today = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`;
    if (user) {
      firebaseService
        .streamWith<ILoggable>('logs', {
          'date >=': today,
          'operator =': profile?.key || '',
        })
        .subscribe({
          next(logs) {
            logs.forEach(async (log) => {
              if (sent[log.key] || log.operator === user.uid) return;
              const { badge, body, title } = await translateLogToNotification(
                log
              );

              const clients = await self.clients.matchAll({ type: 'window' });
              if (body.includes(`[${user.displayName}]`)) {
                await notify(body, 'You are mentioned on', badge);
              }
              await notify(body, title, badge);
              async function notify(
                content: string,
                subject: string,
                icon?: string
              ) {
                //if (clients.find(c => c.focused)) return;
                await self.registration.showNotification(subject, {
                  body: content,
                  icon: (location?.origin || '') + '/icons/asc-icon.png',
                  badge: icon,
                  silent: false,
                  data: log,
                  tag: log.key,
                });

                clients.forEach((client) => {
                  client.postMessage({
                    type: 'newNotification',
                    tag: log.key,
                    title: subject,
                    body: content,
                    icon: icon,
                    data: log,
                  });
                });
                const logDate = new Date(log.date);
                const logDay = `${logDate.getFullYear()}-${pad(
                  logDate.getMonth() + 1
                )}-${pad(logDate.getDate())} ${pad(logDate.getHours())}:${pad(
                  logDate.getMinutes()
                )}:${pad(logDate.getSeconds())}`;
              }
              sent[log.key] = true;
            });
          },
        });
    }
  }
}
