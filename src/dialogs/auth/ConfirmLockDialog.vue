<template>
  <q-dialog v-model="showDialog">
    <q-card>
      <q-card-section class="text-h2">
        Your are about to lock your screen.
      </q-card-section>
      <q-card-section class="text-h4"> Are you sure? </q-card-section>
      <q-card-actions>
        <q-btn v-close-popup icon="ok" @click="proceedLock">Yes</q-btn>
        <q-btn v-close-popup icon="cancel" @click="cancel">No</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { TheDialogs } from '../the-dialogs';

const showDialog = ref(false);
const successCb = ref<VoidCallback>();
const errorCb = ref<ErrorCallback>();
TheDialogs.on({
  type: 'confirmLockDialog',
  cb(e) {
    showDialog.value = true;
    successCb.value = e.success;
    errorCb.value = e.error;
  },
});
function proceedLock() {
  successCb.value && successCb.value();
}
function cancel() {
  errorCb.value && errorCb.value(new Error('Cancelled'));
}
</script>
