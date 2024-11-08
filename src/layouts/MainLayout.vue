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

      <UserProfileCard username="Username" email="email@gmail.com" />
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

const { locale } = useI18n({ useScope: 'global' });

const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'fil-PH', label: 'Tagalog' },
];

const leftDrawerOpen = ref(true);

const menuOptions: MenuOptionItem[] = [
  { name: 'profile', label: 'PROFILE', icon: 'person' },
  { name: 'appointment', label: 'APPOINTMENT', icon: 'event' },
  { name: 'notification', label: 'NOTIFICATION', icon: 'notifications' },
  { name: 'history', label: 'HISTORY', icon: 'history' },
];

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
