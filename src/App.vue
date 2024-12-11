<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';

defineOptions({
  name: 'App',
});
onMounted(() => {
  import('src/workflows');
});
const $q = useQuasar();
if (
  ($q.platform.is.android ||
    $q.platform.is.ios ||
    typeof Notification != 'undefined') &&
  !['granted', 'denied'].includes(Notification.permission)
) {
  Notification.requestPermission();
}
</script>
