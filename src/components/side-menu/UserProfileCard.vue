<template>
  <div class="q-mt-md row items-center justify-center">
    <div class="column items-center">
      <q-icon name="account_circle" color="white" size="64px" />
      <div class="column items-center">
        <span class="text-white text-bold text-h6">{{
          truncateText(username, 14)
        }}</span>
        <span class="text-white text-caption">{{
          truncateText(email, 30)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  username: string;
  email: string;
}>();

const truncateText = (text: string, maxLength: number = 39) =>
  text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
</script>
