<template>
  <q-dialog v-model="studentAdminDialog" persistent>
    <q-card style="min-width: 300px; border-radius: 22px">
      <q-card-section class="text-center bg-primary text-white">
        <span class="text-h6 q-ml-sm q-pa-xl text-bold"
          >STUDENT CONFIRMATION</span
        >
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="formFields.idNumber"
          label="ID Number"
          :rules="[isRequired]"
          class="no-spinner"
          type="number"
        />
        <q-input
          v-model="formFields.program"
          label="Program"
          :rules="[isRequired]"
        />
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-1">
        <q-btn flat label="Cancel" color="dark" v-close-popup icon="close" />
        <q-btn
          flat
          label="Confirm"
          color="primary"
          icon="check_circle"
          @click="onRequest"
          v-close-popup
          :disable="!isFormValid"
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
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const studentAdminDialog = ref(false);
const $q = useQuasar();
const formFields = reactive({
  idNumber: '',
  program: '',
});

const isRequired = (val: string) => {
  if (!val) return 'Field is required!';
  return true;
};

const isFormValid = computed(() => {
  return formFields.idNumber && formFields.program;
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
        router.replace({ name: 'pending-application' });
      },
      error: (err) => {
        console.log(err);
      },
    },
  });
}
</script>

<style lang="scss">
.no-spinner {
  input[type='number'] {
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}
</style>
