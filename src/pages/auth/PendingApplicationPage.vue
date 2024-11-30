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

    <span
      class="text-primary text-center"
      :class="{
        'text-h6 q-mb-sm': $q.screen.xs,
        'text-h5 q-mb-md': $q.screen.sm,
        'text-h4 q-mb-lg': $q.screen.md,
        'text-h2 q-mb-lg': $q.screen.lg,
      }"
      >YOUR APPLICATION IS BEING PROCESSED.</span
    >

    <q-spinner
      color="primary"
      :size="$q.screen.lt.sm ? '2em' : $q.screen.lt.md ? '3em' : '5em'"
    />
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
