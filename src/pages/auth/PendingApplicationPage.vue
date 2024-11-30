<template>
  <q-page class="column justify-center items-center q-page">
    <div
      class="absolute-top-left q-ma-lg flex items-center cursor-pointer"
      v-ripple
      @click="logout"
    >
      <q-btn round color="secondary" size="sm" icon="logout" class="q-mr-sm" />
      <span class="text-primary text-h6 text-bold text-center">LOGOUT</span>
    </div>

    <span class="text-h2 text-primary text-center q-mb-xl"
      >YOUR APPLICATION IS BEING PROCESSED.</span
    >

    <q-spinner color="primary" size="5em" />
  </q-page>
</template>

<script setup lang="ts">
import { TheDialogs } from 'src/dialogs/the-dialogs';
import { useRouter } from 'vue-router';

const $router = useRouter();

function logout() {
  TheDialogs.emit({
    type: 'logoutDialog',
    arg: {
      success() {
        $router.replace({
          name: 'login',
        });
      },
    },
  });
}
</script>

<style lang="sass"></style>
