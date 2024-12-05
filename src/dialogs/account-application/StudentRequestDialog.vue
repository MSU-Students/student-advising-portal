<template>
  <q-dialog v-model="studentAdminDialog">
    <q-card style="min-width: 300px; border-radius: 22px">
      <q-card-section class="text-center bg-primary text-white">
        <span class="text-h6 q-ml-sm q-pa-xl text-bold"
          >STUDENT CONFIRMATION</span
        >
      </q-card-section>

      <q-form class="q-pa-md" @confirm="onRequest">
        <q-input
          v-model="formFields.idNumber"
          label="ID Number"
          :rules="[isRequired]"
          class="no-spinner"
          type="number"
          @keydown.enter="focusNext"
        />
        <q-input
          v-model="formFields.program"
          label="Program"
          :rules="[isRequired]"
          @keydown.enter="focusNext"
        />

        <div align="right">
          <q-btn flat label="Cancel" color="dark" v-close-popup icon="close" />
          <q-btn
            flat
            label="Confirm"
            color="primary"
            icon="check_circle"
            type="confirm"
            v-close-popup
            :disable="!isFormValid"
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
      },
      error: (err) => {
        console.log(err);
      },
    },
  });
}

function focusNext(e: KeyboardEvent) {
  const target = e.target as HTMLInputElement | null;

  if (target) {
    const inputs = Array.from(
      target.form?.querySelectorAll('input') || []
    ) as HTMLInputElement[];
    const index = inputs.indexOf(target);

    if (index < inputs.length - 1) {
      inputs[index + 1].focus();
    } else if (isFormValid.value) {
      onRequest();
    }

    e.preventDefault();
  }
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
