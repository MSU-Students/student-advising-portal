<template>
  <q-dialog v-model="rejectDialog">
    <q-card class="rounded-borders">
      <q-card-section
        class="row items-center q-gutter-sm bg-negative text-white"
      >
        <q-icon name="close" color="white" size="md" />
        <span class="text-h6">Reject Application</span>
      </q-card-section>
      <q-card-section class="q-pa-md">
        <div>Are you sure you want to reject {{ selectedApplicant }}?</div>
        <q-input
          autogrow
          counter
          v-model="reason"
          label="Reason"
          :rules="[(val) => !!val || 'Reason is required!']"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" @click="rejectDialog = false" />
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
  if (!request.value) return;
  request.value.remarks = reason.value;
  TheWorkflows.emit({
    type: 'rejectApplication',
    arg: {
      payload: request.value,
      success() {
        succesCb.value && succesCb.value();
        rejectDialog.value = false;
      },
    },
  });
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
