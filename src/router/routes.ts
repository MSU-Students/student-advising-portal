import { RouteRecordRaw } from 'vue-router';
import { IRouteMeta } from './route.meta';
import LoginPage from 'src/pages/auth/LoginPage.vue';
import ProfilePage from 'src/pages/ProfilePage.vue';
import ConsultationPage from 'src/pages/booking/ConsultationPage.vue';
import AppointmentsPage from 'src/pages/booking/AppointmentsPage.vue';

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
          anonymous: true,
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
        path: 'sign-up',
        name: 'sign-up',
        component: () => import('pages/auth/SignupPage.vue'),
        meta: {},
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('pages/auth/ForgotPasswordPage.vue'),
        meta: {
          anonymous: true,
        },
      },
      {
        path: 'action',
        component: () => import('pages/auth/AuthHandlerPage.vue'),
        meta: {
          anonymous: true,
        },
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('pages/auth/ResetPasswordPage.vue'),
        meta: {
          anonymous: true,
        },
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
        path: 'profile/:key',
        name: 'profile',
        component: ProfilePage,
        meta: {
          requiresLogin: true,
        },
      },
      {
        path: 'student',
        name: 'student',
        component: () => import('pages/students/StudentsPage.vue'),
        meta: {
          requiresLogin: ['student'],
          menu: 'Student',
          title: 'Student Page',
          icon: 'person',
        },
      },
      {
        name: 'booking',
        path: 'booking',
        component: () => import('pages/booking/BookingPage.vue'),
        meta: {
          requiresLogin: ['student'],
          menu: 'Booking',
          title: 'Booking Page',
          icon: 'library_books',
        },
      },
      {
        name: 'edit-booking',
        path: 'booking/:key',
        component: () => import('pages/booking/EditBookingPage.vue'),
        meta: {
          requiresLogin: ['student', 'adviser'],
        },
      },
      {
        name: 'calendar',
        path: 'calendar',
        component: () => import('pages/booking/CalendarViewPage.vue'),
        meta: {
          requiresLogin: ['student', 'adviser'],
          menu: 'Calendar',
          title: 'Calendar',
          icon: 'library_books',
        },
      },
      {
        name: 'consultations',
        path: 'consultations',
        component: ConsultationPage,
        meta: {
          requiresLogin: ['adviser'],
          menu: 'Consulations',
          title: 'Consulations',
          icon: 'group',
        },
      },
      {
        name: 'appointments',
        path: 'appointments',
        component: AppointmentsPage,
        meta: {
          requiresLogin: ['adviser', 'student', 'admin'],
          menu: 'Appointments',
          title: 'Appointments',
          icon: 'groups',
        },
      },
      {
        path: 'application',
        name: 'application',
        component: () => import('pages/admin/ApplicationPage.vue'),
        meta: {
          requiresLogin: ['admin'],
          menu: 'Application',
          title: 'Application Page',
          icon: 'work_outline',
        },
        children: [
          {
            path: 'admin',
            name: 'admin-application',
            component: () => import('pages/admin/AdminAppPage.vue'),
            meta: {
              requiresLogin: ['admin'],
              menu: 'Admin Application',
              title: 'Admin Page',
              icon: 'admin_panel_settings',
              parent: 'application',
            },
          },
          {
            path: 'adviser',
            name: 'adviser-application',
            component: () => import('pages/admin/AdviserAppPage.vue'),
            meta: {
              requiresLogin: ['admin'],
              menu: 'Adviser Application',
              title: 'Adviser Page',
              icon: 'school',
              parent: 'application',
            },
          },
          {
            path: 'student',
            name: 'student-application',
            component: () => import('pages/admin/StudentAppPage.vue'),
            meta: {
              requiresLogin: ['admin'],
              menu: 'Student Application',
              title: 'Student Page',
              icon: 'person',
              parent: 'application',
            },
          },
        ],
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
