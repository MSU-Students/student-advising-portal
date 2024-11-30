import { RouteRecordRaw } from 'vue-router';
import { IRouteMeta } from './route.meta';
import LoginPage from 'src/pages/auth/LoginPage.vue';

declare module 'vue-router' {
  interface RouteMeta extends IRouteMeta {
    description?: string;
    keywords?: string[];
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('layouts/PlainLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginPage,
        meta: {
          anonygmous: true,
        },
      },
      {
        path: 'get-started',
        name: 'get-started',
        component: () => import('pages/auth/GetStartedPage.vue'),
        meta: {
          requiresLogin: true,
        },
      },
      {
        path: 'pending-application',
        name: 'pending-application',
        component: () => import('pages/auth/PendingApplicationPage.vue'),
        meta: {
          requiresLogin: true,
        },
      },
      {
        path: 'sign-up',
        name: 'sign-up',
        component: () => import('pages/auth/SignupPage.vue'),
        meta: {},
      },
      {
        path: 'email-verify',
        name: 'email-verify',
        component: () => import('pages/auth/EmailVerificationPage.vue'),
        meta: {
          requiresLogin: true,
        },
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
        meta: {
          requiresLogin: ['admin', 'student', 'adviser'],
          menu: 'Home',
          title: 'Home Page',
          icon: 'home',
        },
      },
      {
        path: 'student',
        component: () => import('pages/students/StudentsPage.vue'),
        meta: {
          menu: 'Student',
          title: 'Student Page',
          icon: 'person',
        },
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('pages/admin/AdminPage.vue'),
        meta: {
          menu: 'Admin',
          title: 'Admin Page',
          icon: 'admin_panel_settings',
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
