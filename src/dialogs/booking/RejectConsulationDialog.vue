<template>
  <q-dialog v-model="rejectDialog" persistent>
    <q-card class="q-pa-md bg-white rounded-borders">
      <q-form @submit="rejectApplication">
        <q-card-section class="text-center bg-primary text-white">
          <span class="text-h6 q-ml-sm q-pa-xl text-bold"
            >Reject Consultation
          </span>
        </q-card-section>
        <q-card-section v-if="payload">
          <div v-if="typeof payload.advisee == 'object'" class="q-my-md">
            <q-avatar size="sm"
              ><q-img :src="payload.advisee.avatar" />
            </q-avatar>
            {{ payload.advisee.fullName }} (Advisee)
          </div>
          <div v-if="typeof payload.adviser == 'object'">
            <q-avatar size="sm"
              ><q-img :src="payload.adviser.avatar" />
            </q-avatar>
            {{ payload.adviser.fullName }} (Adviser)
          </div>
        </q-card-section>
        <q-card-section class="text-center">
          <q-input
            v-model="reason"
            label="Rejection reason"
            filled
            type="textarea"
            :rules="[(v) => v.length || 'Enter your rejection reason']"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="blue-9" v-close-popup />
          <q-btn flat label="Reject" color="negative" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TheDialogs } from '../the-dialogs';
import { TheWorkflows } from 'src/workflows/the-workflows';
import { IConsultationBooking } from 'src/entities';

const rejectDialog = ref(false);
const reason = ref('');
const successCb = ref<() => void>();
const errorCb = ref<ErrorCallback>();
const payload = ref<IConsultationBooking>();
TheDialogs.on({
  type: 'rejectConsultationDialog',
  cb(e) {
    payload.value = e.payload;
    rejectDialog.value = true;
    successCb.value = e.success;
    errorCb.value = e.error;
  },
});

function rejectApplication() {
  if (!payload.value) return;
  TheWorkflows.emit({
    type: 'rejectConsultation',
    arg: {
      payload: {
        reason: reason.value,
        booking: payload.value,
      },
      success() {
        successCb.value?.();
        rejectDialog.value = false;
      },
      error(err) {
        errorCb.value?.(new Error(String(err)));
      },
    },
  });
}
</script>
