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
          :class="logoutBtnClicked ? 'bg-red' : ''"
          v-on:click="logoutBtnClicked = !logoutBtnClicked"
        />
      </div>

      <q-dialog v-model="logoutBtnClicked" persistent>
        <q-card style="min-width: 300px">
          <q-card-section class="bg-primary text-white row items-center">
            <q-avatar
              icon="logout"
              color="white"
              text-color="primary"
              size="md"
            />
            <span class="text-h6 q-ml-sm">Confirm Logout</span>
          </q-card-section>

          <q-card-section class="q-pt-md">
            <div class="row items-center">
              <q-icon
                name="warning"
                color="warning"
                size="md"
                class="q-mr-sm"
              />
              <span>Are you sure you want to logout from the system?</span>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="bg-grey-1">
            <q-btn
              flat
              label="Cancel"
              color="dark"
              v-close-popup
              icon="close"
              class="q-px-md"
            />
            <q-btn
              flat
              label="Logout"
              color="negative"
              v-close-popup
              icon="logout"
              class="q-px-md"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
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
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MenuOptions from 'src/components/side-menu/MenuOptions.vue';
import UserProfileCard from 'src/components/side-menu/UserProfileCard.vue';
import { MenuOptionItem } from 'src/components/side-menu/types';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n({ useScope: 'global' });

const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'fil-PH', label: 'Tagalog' },
];

const leftDrawerOpen = ref(true);
const logoutBtnClicked = ref(false);

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
