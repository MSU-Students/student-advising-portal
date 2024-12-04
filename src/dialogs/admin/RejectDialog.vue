<template>
  <q-dialog v-model="rejectDialog" persistent>
    <q-card
      class="q-pa-md bg-white rounded-borders"
    >
      <q-card-section class="text-center">
        <div class="text-h6">
          Are you sure you want to reject {{ selectedApplicant }}?
        </div>
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

<script setup>
import { ref } from 'vue';
import { TheDialogs } from '../the-dialogs';

const rejectDialog = ref(false);
const selectedApplicant = ref('');

TheDialogs.on({
  type: 'applicationRejectDialog',
  cb(e) {
    rejectDialog.value = true;
    e.success;
  },
});

const rejectApplication = () => {
  console.log('Application rejected');
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
