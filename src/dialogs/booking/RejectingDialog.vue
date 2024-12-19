<template>
  <q-dialog v-model="rejectDialog" persistent>
    <q-card class="q-pa-md bg-white rounded-borders">
      <q-card-section class="text-center">
        <div class="text-h6">Reason for Rejection</div>
        <q-input
          v-model="reason"
          label="Enter your rejection reason"
          filled
          type="textarea"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          color="blue-9"
          @click="rejectDialog = false"
        />
        <q-btn
          flat
          label="Reject"
          color="negative"
          @click="rejectApplication"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { defineExpose } from 'vue';

interface Payload {
  id: string;
  [key: string]: unknown;
}

interface ErrorType {
  message: string;
  code?: number;
}

const rejectDialog = ref(false);
const reason = ref('');
const successCb = ref<() => void>();
const errorCb = ref<(error: ErrorType) => void>();

function showRejectDialog(
  payload: Payload,
  success: () => void,
  error: (e: ErrorType) => void
) {
  rejectDialog.value = true;
  successCb.value = success;
  errorCb.value = error;
}

defineExpose({
  showRejectDialog,
});

function rejectApplication() {
  if (!reason.value.trim()) {
    alert('Please provide a reason for rejection.');
    return;
  }

  try {
    successCb.value?.();
    rejectDialog.value = false;
  } catch (e) {
    errorCb.value?.({
      message: 'An error occurred.',
      ...(e instanceof Error ? { code: 500, message: e.message } : {}),
    });
  }
}
</script>
