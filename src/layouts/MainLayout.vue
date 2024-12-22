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
      </q-toolbar>

      <router-view />
      <LogOutDialog />
      <ConfirmLockDialog />

      <!-- Admin Dialogs -->
      <RejectApplicationDialog />
      <ViewStudentApplication />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
import LogOutDialog from 'src/dialogs/auth/LogOutDialog.vue';
import ViewStudentApplication from 'src/dialogs/admin/ViewStudentApplication.vue';

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
</script>
