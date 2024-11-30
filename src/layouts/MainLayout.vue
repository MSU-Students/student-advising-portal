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
        <q-btn
          outline
          rounded
          color="white"
          label="LOGOUT"
          class="q-px-xl"
          @click="TheDialogs.emit({ type: 'logoutDialog', arg: {} })"
        />
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
          {{ $t('ok') }}
        </q-toolbar-title>
        <q-space />

        <SearchbarComponent />
        
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
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MenuOptions from 'src/components/side-menu/MenuOptions.vue';
import UserProfileCard from 'src/components/side-menu/UserProfileCard.vue';
import { MenuOptionItem } from 'src/components/side-menu/types';
import { useI18n } from 'vue-i18n';
import { TheDialogs } from 'src/dialogs/the-dialogs';
import LogOutDialog from 'src/dialogs/auth/LogOutDialog.vue';
import { useAuthStore } from 'src/stores/auth.store';
import { useRouter } from 'vue-router';
import ConfirmLockDialog from 'src/dialogs/auth/ConfirmLockDialog.vue';
import SearchbarComponent from 'src/components/search-bar/SearchbarComponent.vue';

const { locale } = useI18n({ useScope: 'global' });

const authStore = useAuthStore();

const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'fil-PH', label: 'Tagalog' },
];

const leftDrawerOpen = ref(true);
const $router = useRouter();

const menuOptions: MenuOptionItem[] = $router
  .getRoutes()
  .filter((r) => r.meta?.menu)
  .map((r) => {
    return {
      icon: r.meta.icon,
      label: r.meta.menu,
      name: r.name,
      link: r,
    } as MenuOptionItem;
  });

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
