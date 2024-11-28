<template>
  <q-page> Check your email to verify your account </q-page>
</template>
<script lang="ts" setup>
import { useAuthStore } from 'src/stores/auth.store';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const $router = useRouter();
onMounted(async () => {
  const user = await authStore.getUser();
  if (user?.emailVerified) {
    $router.replace({
      name: 'home',
    });
  }
});
</script>
