<script setup lang="ts">
import { ref } from 'vue';
import { TheDialogs } from '../the-dialogs';
import { IProfile, IRequest } from 'src/entities';
import { TheWorkflows } from 'src/workflows/the-workflows';

// Variables
const viewDialog = ref(false);
const successCb = ref<VoidCallback>();
const errorCb = ref<ErrorCallback>();
const request = ref<IRequest>();
const data = ref<IProfile>();

const personalDetails = [
  { field: 'fullName', label: 'Full Name' },
  { field: 'email', label: 'Email' },
];

const studentDetails = [
  { field: 'idNumber', label: 'ID Number' },
  { field: 'program', label: 'Program' },
];

// Methods
TheDialogs.on({
  type: 'viewStudentApplicationDialog',
  cb(e) {
    viewDialog.value = true;
    request.value = e.payload as IRequest;
    data.value = e.payload.data || <IProfile>{};
    successCb.value = e.success;
    errorCb.value = e.error;
  },
});

function approveApplication() {
  TheWorkflows.emit({
    type: 'approveApplication',
    arg: {
      payload: request.value as IRequest,
    },
  });
  viewDialog.value = false;
}

function rejectApplication() {
  TheDialogs.emit({
    type: 'applicationRejectDialog',
    arg: {
      payload: request.value as IRequest,
    },
  });
  viewDialog.value = false;
}
</script>

<template>
  <q-dialog v-model="viewDialog">
    <q-card class="view-dialog q-pa-md rounded-borders">
      <q-card-section class="text-h5"> Application Details </q-card-section>
      <q-card-section>
        <span class="text-bold">Personal Details</span>
        <q-input
          readonly
          v-for="property of personalDetails"
          v-model="data[property.field]"
          :key="property"
          :label="property.label"
        />
      </q-card-section>
      <q-card-section>
        <span class="text-bold">Student Details</span>
        <q-input
          readonly
          v-for="property of studentDetails"
          v-model="data[property.field]"
          :key="property"
          :label="property.label"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          icon="check"
          color="positive"
          label="Approve"
          @click="approveApplication"
        />
        <q-btn
          flat
          icon="close"
          color="negative"
          label="Reject"
          @click="rejectApplication"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.view-dialog {
  width: 100%;
  max-width: 500px;
}
</style>
