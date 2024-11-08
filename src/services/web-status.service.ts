/* eslint-disable @typescript-eslint/no-floating-promises */
import pkg from '../../package.json';
import { Observable, Subscriber } from 'rxjs';

type WebStatus = { isOnline?: boolean; isAuth?: boolean };
let subscriber: Subscriber<WebStatus>;
const observable = new Observable<WebStatus>((sub) => {
  subscriber = sub;
});
function updateStatus(status?: WebStatus) {
  let { isOnline } = status || {};
  isOnline = typeof isOnline == 'undefined' ? navigator.onLine : isOnline;
  subscriber?.next(
    typeof status != 'undefined'
      ? status
      : {
        isOnline,
      }
  );
}

window.addEventListener('DOMContentLoaded', () => {
  updateStatus();
  window.addEventListener('offline', () => updateStatus);
  window.addEventListener('online', () => updateStatus);
});

class WebStatusService {
  isOnline = navigator.onLine;
  updateApp() {
    const wndow = window as unknown as { reload: (force: boolean) => void };
    if (typeof wndow.reload == 'function') {
      wndow.reload(true);
    }
    if (typeof window.location.reload == 'function') {
      window.location.reload();
    }
  }
  getCurrentVersion() {
    return pkg.version;
  }

  subscribe(cb: (status: WebStatus) => void) {
    observable.subscribe(cb);
  }
  updateStatus(status: WebStatus) {
    updateStatus(status);
  }
}

export const webStatusService = new WebStatusService();
