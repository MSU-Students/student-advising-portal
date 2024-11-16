<template>
  <q-page class="row items-center justify-evenly q-px-lg">
    <q-banner v-if="message" rounded class="bg-purple-8 text-white full-width">
      {{ message }}
    </q-banner>
    <q-btn @click="lockScreen" icon="lock">Lock Screen</q-btn>
  </q-page>
</template>

<script setup lang="ts">
import { TheDialogs } from 'src/dialogs/the-dialogs';
import { ref } from 'vue';
const message = ref('');
defineOptions({
  name: 'IndexPage',
});

function lockScreen() {
  TheDialogs.emit({
    type: 'confirmLockDialog',
    arg: {
      success() {
        message.value = "You're screen is about to lock";
      },
      error(err) {
        message.value = String(err);
      },
    },
  });
}
</script>
