<template>
  <div class="q-mt-md row items-center justify-center">
    <div class="column items-center">
      <q-icon v-if="!avatar" name="account_circle" color="white" size="64px" />
      <q-avatar v-else><q-img :src="avatar" /></q-avatar>
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
defineProps<{
  username: string;
  email: string;
  avatar?: string;
}>();

const truncateText = (text: string, maxLength: number = 39) =>
  text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
</script>
