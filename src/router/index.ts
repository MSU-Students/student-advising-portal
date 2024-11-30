import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { useAuthStore } from 'src/stores/auth.store';
import { useRequestStore } from 'src/stores/request.store';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;
  const authStore = useAuthStore();
  const requestStore = useRequestStore();
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });
  Router.beforeEach(async (to, from, next) => {
    const user = await authStore.getUser();
    const request = await requestStore.getRequest(user?.key || '');

    if (to.meta?.requiresLogin && !user) {
      next({
        name: 'login',
      });
    } else if (
      user?.type == 'anonymous' &&
      request?.status === 'pending' &&
      to.name !== 'pending-application'
    ) {
      console.log('hi');
      next({ name: 'pending-application' });
    } else if (
      Array.isArray(to.meta?.requiresLogin) &&
      (!user?.type || user.type == 'anonymous')
    ) {
      next({
        name: 'get-started',
      });
    } else if (
      Array.isArray(to.meta?.requiresLogin) &&
      user?.type &&
      !to.meta?.requiresLogin.includes(user.type)
    ) {
      next({
        name: 'home',
      });
    } else if (to.meta.anonymous && !!user) {
      next({
        name: 'home',
      });
    } else {
      next();
    }
  });

  return Router;
});
