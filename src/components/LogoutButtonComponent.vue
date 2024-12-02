<template>
  <div
    class="absolute-top-left q-ma-lg flex items-center cursor-pointer"
    v-ripple
    @click="logout"
  >
    <q-btn round color="secondary" size="sm" icon="logout" class="q-mr-sm" />
    <span class="text-primary text-h6 text-bold text-center">LOGOUT</span>
  </div>
</template>

<script lang="ts" setup>
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
