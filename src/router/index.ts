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
    const userType = user?.type;
    const userKey = user?.key || '';
    const request = await requestStore.getRequest(userKey);

    const requiresLogin = Array.isArray(to.meta?.requiresLogin)
      ? to.meta.requiresLogin
      : to.meta?.requiresLogin;

    // redirect to login if route requires login and user is not logged in.
    if (requiresLogin && !user) {
      console.log('hi');
      return next({ name: 'login' });
    }

    // redirect anonymous users with no pending request to the get started page.
    if (userType === 'anonymous' && !request && to.name !== 'get-started') {
      return next({ name: 'get-started' });
    }

    // redirect anonymous users with pending request to the pending application page.
    if (
      userType === 'anonymous' &&
      request?.status === 'pending' &&
      to.name !== 'pending-application'
    ) {
      return next({ name: 'pending-application' });
    }

    // Redirect to the home page if the user's role does not match the required roles for the route.
    if (
      Array.isArray(requiresLogin) &&
      userType &&
      !requiresLogin.includes(userType)
    ) {
      return next({ name: 'home' });
    }

    // redirect authenticated users away from anonymous-focused routes.
    if (to.meta.anonymous && !!user) {
      return next({ name: 'home' });
    }

    // Allow navigation if none of the conditions are met.
    return next();
  });

  return Router;
});
