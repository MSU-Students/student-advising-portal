<template>
  <q-layout view="hHh lpR fFf">
    <q-drawer
      class="bg-primary q-pa-md"
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      elevated
    >
      <q-icon
        class="absolute-top-right q-pa-md cursor-pointer"
        name="menu"
        size="sm"
        color="white"
        @click="toggleLeftDrawer"
      />
      <UserProfileCard
        :avatar="authStore.currentUser?.avatar"
        :username="authStore.currentUser?.fullName || ''"
        :email="authStore.currentUser?.email || 'no-mail'"
      />
      <MenuOptions :menu-options="menuOptions" class="q-mt-xl" />
      <div class="absolute-bottom text-center q-mb-md">
        <LogoutButton white />
      </div>
    </q-drawer>

    <q-page-container>
      <q-toolbar>
        <q-btn
          v-if="!leftDrawerOpen"
          flat
          round
          dense
          icon="menu"
          size="sm"
          color="primary"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          {{ 'Student Advising Portal' }}
        </q-toolbar-title>
        <q-space />

        <SearchbarComponent v-if="$route.name !== 'booking'" />
        <q-select
          v-model="locale"
          :options="localeOptions"
          label="Language"
          dense
          borderless
          emit-value
          map-options
          options-dense
          style="min-width: 150px"
        />
        <q-btn round dense icon="notifications">
          <q-popup-proxy style="min-width: 200px">
            <q-list
              :style="'max-width:' + $q.screen.sizes.sm + 'px'"
              v-if="notificationCount"
            >
              <q-item
                v-for="n in notificationStore.notifications"
                :key="n.tag"
                clickable
                v-close-popup
                v-touch-swipe.mouse.left.right="() => deleteNotification(n)"
                @click="routeNotification(n)"
              >
                <q-item-section avatar>
                  <q-avatar>
                    <q-img :src="n.badge" v-if="n.badge" />
                    <q-icon name="person" v-else />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ n.title }}</q-item-label>
                  <q-item-label caption>{{ n.body }}</q-item-label>
                </q-item-section>
                <q-item-section side v-if="n.log">
                  {{ stampTime(n.log.date) }}
                </q-item-section>
              </q-item>
            </q-list>
            <q-banner v-else class="bg-warning">No Notitications</q-banner>
          </q-popup-proxy>
        </q-btn>
      </q-toolbar>

      <router-view />
      <LogOutDialog />
      <ConfirmLockDialog />
      <RejectApplicationDialog />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import MenuOptions from 'src/components/side-menu/MenuOptions.vue';
import UserProfileCard from 'src/components/side-menu/UserProfileCard.vue';
import { MenuOptionItem } from 'src/components/side-menu/types';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from 'src/stores/auth.store';
import { RouteMeta, useRouter } from 'vue-router';

// COMPONENTS
import MenuOptions from 'src/components/side-menu/MenuOptions.vue';
import UserProfileCard from 'src/components/side-menu/UserProfileCard.vue';
import LogoutButton from 'src/components/LogoutButton.vue';
import SearchbarComponent from 'src/components/search-bar/SearchbarComponent.vue';

// DIALOGS
import ConfirmLockDialog from 'src/dialogs/auth/ConfirmLockDialog.vue';
import RejectApplicationDialog from 'src/dialogs/admin/RejectApplicationDialog.vue';
import {
  NotificationInfo,
  useNotificationStore,
} from 'src/stores/notification.store';
import { theBus } from 'src/the-bus';
import { date } from 'quasar';
import LogOutDialog from 'src/dialogs/auth/LogOutDialog.vue';


const { locale } = useI18n({ useScope: 'global' });
const authStore = useAuthStore();
const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'fil-PH', label: 'Tagalog' },
];

const leftDrawerOpen = ref(true);
const $router = useRouter();
const allRoutes = $router.getRoutes();
function hasAccess(routeMeta?: RouteMeta) {
  if (!authStore.currentUser) return false;
  if (!routeMeta || !routeMeta.requiresLogin) return true;
  return Array.isArray(routeMeta.requiresLogin)
    ? routeMeta.requiresLogin.includes(authStore.currentUser.type)
    : !!routeMeta.requiresLogin && !!authStore.currentUser.type;
}

const menuOptions: MenuOptionItem[] = allRoutes
  .filter((r) => r.meta?.menu && !r.meta.parent && hasAccess(r.meta))
  .map((r) => {
    return {
      icon: r.meta.icon,
      label: r.meta.menu,
      name: r.name,
      link: r,
      submenu: allRoutes
        .filter(
          (r2) =>
            r2.meta.parent == r.name && r2.meta?.menu && hasAccess(r2.meta)
        )
        .map((r2) => {
          return {
            label: r2.meta.menu,
            name: r2.name,
            link: r2,
            icon: r2.meta.icon,
          } as MenuOptionItem;
        }),
    } as MenuOptionItem;
  });

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const notificationStore = useNotificationStore();
const notificationCount = computed(() => {
  return notificationStore.notifications.length;
});
onMounted(() => {
  return notificationStore.load();
});
function routeNotification(item: NotificationInfo) {
  theBus.emit('routeNotification', item.log);
  notificationStore.closeNotification(item);
}
function stampTime(dateTime: string) {
  const now = new Date();
  const diffDays = date.getDateDiff(now, dateTime, 'days');
  const diffHours = date.getDateDiff(now, dateTime, 'hours');
  const diffMins = date.getDateDiff(now, dateTime, 'minutes');
  const diffSeconds = date.getDateDiff(now, dateTime, 'seconds');
  if (diffDays > 0) {
    return `${diffDays} days ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hours ago`;
  } else if (diffMins > 0) {
    return `${diffMins} minutes ago`;
  } else {
    return `${diffSeconds} seconds ago`;
  }
}
function deleteNotification(item: NotificationInfo) {
  notificationStore.closeNotification(item);
}
</script>
