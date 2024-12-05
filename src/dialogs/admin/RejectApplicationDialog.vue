<template>
  <q-dialog v-model="rejectDialog" persistent>
    <q-card class="q-pa-md bg-white rounded-borders">
      <q-card-section class="text-center">
        <div class="text-h6">
          Are you sure you want to reject {{ selectedApplicant }}?
        </div>
        <q-input v-model="reason" label="reason" />
      </q-card-section>
      <q-card-actions>
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
import { computed, ref } from 'vue';
import { TheDialogs } from '../the-dialogs';
import { IRequest } from 'src/entities';
import { TheWorkflows } from 'src/workflows/the-workflows';

const rejectDialog = ref(false);
const request = ref<IRequest>();
const selectedApplicant = computed(() => request.value?.data.fullName);
const reason = ref('');
const succesCb = ref<VoidCallback>();
const errorCb = ref<ErrorCallback>();
TheDialogs.on({
  type: 'applicationRejectDialog',
  cb(e) {
    rejectDialog.value = true;
    request.value = e.payload;
    succesCb.value = e.success;
    errorCb.value = e.error;
  },
});

const rejectApplication = () => {
  TheWorkflows.emit({
    type: '',
  });
  succesCb.value && succesCb.value();
  rejectDialog.value = false;
};
</script>

<style scoped>
.text-right {
  text-align: right;
}

.bg-primary {
  background-color: var(--q-color-primary);
}
</style>
