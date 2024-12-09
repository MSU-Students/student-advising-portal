<template>
  <template v-if="props.white">
    <q-btn
      outline
      rounded
      :color="props.white ? 'white' : 'primary'"
      icon="logout"
      label="LOGOUT"
      class="q-px-xl"
      @click="logout"
    />
  </template>
  <template v-else>
    <div v-ripple class="flex items-center cursor-pointer" @click="logout">
      <q-btn round color="primary" icon="logout" />
      <span class="text-primary text-h6 q-ml-sm text-center">LOGOUT</span>
    </div>
  </template>
</template>

<script setup lang="ts">
import { TheDialogs } from 'src/dialogs/the-dialogs';
import { useRouter } from 'vue-router';

const props = defineProps({
  white: {
    type: Boolean,
    default: false,
  },
});

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
