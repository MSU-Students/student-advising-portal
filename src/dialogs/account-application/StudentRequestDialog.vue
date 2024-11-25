<template>
  <q-dialog v-model="studentAdminDialog" persistent>
    <q-card style="min-width: 300px">
      <q-card-section class="bg-primary text-white row items-center">
        <q-avatar
          icon="admin_panel_settings"
          color="white"
          text-color="primary"
          size="md"
        />
        <span class="text-h6 q-ml-sm">Student Confirmation</span>
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-input v-model="formFields.idNumber" label="ID Number" />
        <q-input v-model="formFields.program" label="Program" />
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-1">
        <q-btn flat label="Cancel" color="dark" v-close-popup icon="close" />
        <q-btn
          flat
          label="Confirm"
          color="primary"
          icon="check_circle"
          @click="onRequest"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { TheDialogs } from 'src/dialogs/the-dialogs';
import { IProfile, IStudentProfile } from 'src/entities';
import { useAuthStore } from 'src/stores/auth.store';
import { TheWorkflows } from 'src/workflows/the-workflows';
import { uid, useQuasar } from 'quasar';

const authStore = useAuthStore();
const studentAdminDialog = ref(false);
const $q = useQuasar();
const formFields = reactive({
  idNumber: '',
  program: '',
});

const newData = computed(() => {
  return {
    ...(authStore.currentUser as IProfile),
    type: 'student',
    idNumber: formFields.idNumber,
    program: formFields.program,
  } as IStudentProfile;
});

TheDialogs.on({
  type: 'studentApplicationDialog',
  cb() {
    studentAdminDialog.value = true;
  },
});

function resetFormFields() {
  formFields.idNumber = '';
  formFields.program = '';
}

function onRequest() {
  TheWorkflows.emit({
    type: 'createRequest',
    arg: {
      applicant: {
        key: uid(),
        status: 'pending',
        createdAt: Date(),
        data: { ...newData.value },
      },
      success: () => {
        $q.notify('Student application was successful.');
        resetFormFields();
      },
      error: (err) => {
        console.log(err);
      },
    },
  });
}
</script>
