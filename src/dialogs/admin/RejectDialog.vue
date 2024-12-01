<template>
  <q-dialog v-model="rejectDialog" persistent>
    <q-card class="q-pa-md" style="border-radius: 15px; background-color: gray">
      <q-card-section class="text-center">
        <div class="text-h6 text-white">
          Are you sure you want to reject {{ selectedApplicant }}?
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn
          flat
          label="Cancel"
          color="primary"
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

const rejectDialog = ref(false);
const selectedApplicant = ref('');

const showRejectDialog = (row) => {
  selectedApplicant.value = row.applicant;
  rejectDialog.value = true;
};

const rejectApplication = () => {
  console.log('Application rejected');
  rejectDialog.value = false;
};

defineExpose({
  showRejectDialog,
});
</script>

<style scoped>
.text-right {
  text-align: right;
}

.bg-primary {
  background-color: var(--q-color-primary);
}
</style>
