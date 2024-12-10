<template>
  <q-page>
    <q-banner class="fixed-center">Redirecting</q-banner>
  </q-page>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';

const $route = useRoute();
const $router = useRouter();
const mode = $route.params.mode as string;
switch (mode) {
  case 'resetPassword':
    $router.replace({
      name: 'reset-password',
      params: $route.params,
    });
    break;
}
</script>
