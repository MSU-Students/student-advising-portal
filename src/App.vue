<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

defineOptions({
  name: 'App',
});
onMounted(() => {
  import('src/workflows');
});
</script>
