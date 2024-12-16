<template>
  <q-page>
    <q-banner class="fixed-center">Redirecting</q-banner>
  </q-page>
</template>
<script lang="ts" setup>
import { Notify } from 'quasar';
import { useRoute, useRouter } from 'vue-router';

const $route = useRoute();
const $router = useRouter();
const mode = $route.query.mode as string;
switch (mode) {
  case 'resetPassword':
    $router.replace({
      name: 'reset-password',
      query: $route.query,
    });
    break;
  case 'verifyEmail':
    $router.replace({
      name: 'email-verify',
      query: $route.query,
    });
    break;
  case 'recoverEmail':
  default:
    Notify.create({
      message: 'Unknown auth mode:' + mode,
      caption: 'Unable to redirect',
      color: 'negative',
      icon: 'error',
      timeout: 0,
      closeBtn: 'close',
    });
    break;
}
</script>
