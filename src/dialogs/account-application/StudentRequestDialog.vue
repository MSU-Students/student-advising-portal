<template>
  <q-dialog v-model="studentAdminDialog">
    <q-card style="min-width: 300px; border-radius: 22px">
      <q-card-section class="text-center bg-primary text-white">
        <span class="text-h6 q-ml-sm q-pa-xl text-bold"
          >STUDENT CONFIRMATION</span
        >
      </q-card-section>

      <q-form class="q-pa-md" @submit="onRequest">
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

        <div align="right">
          <q-btn flat label="Cancel" color="dark" v-close-popup icon="close" />
          <q-btn
            flat
            label="Confirm"
            color="primary"
            icon="check_circle"
            type="submit"
          />
        </div>
      </q-form>
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

const isRequired = (val: string) => {
  if (!val) return 'Field is required!';
  return true;
};

const newData = computed(() => {
  return {
    ...(authStore.currentUser as IProfile),
    type: 'student',
    idNumber: formFields.idNumber,
    program: formFields.program,
  } as IStudentProfile;
});
const succesCb = ref<VoidCallback>();
TheDialogs.on({
  type: 'studentApplicationDialog',
  cb(e) {
    studentAdminDialog.value = true;
    succesCb.value = e.success;
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
        studentAdminDialog.value = false;
        succesCb.value && succesCb.value();
        resetFormFields();
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
