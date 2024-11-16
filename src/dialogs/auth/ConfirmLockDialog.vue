<template>
  <q-dialog v-model="showDialog"> </q-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { TheDialogs } from '../the-dialogs';

const showDialog = ref(false);

TheDialogs.on({
  type: 'confirmLockDialog',
  cb(e) {
    //
    showDialog.value = true;
  },
});
</script>
