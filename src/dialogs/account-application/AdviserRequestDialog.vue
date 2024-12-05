<template>
  <q-dialog v-model="adviserDialogVisible">
    <q-card style="min-width: 300px; border-radius: 22px">
      <q-card-section class="text-center bg-primary text-white">
        <span class="text-h6 q-ml-sm q-pa-xl text-bold"
          >ADVISER CONFIRMATION</span
        >
      </q-card-section>

      <q-form class="q-pa-md" @submit="onRequest">
        <q-input
          v-model="formFields.college"
          label="College"
          :rules="[isRequired]"
        />
        <q-input
          v-model="formFields.department"
          label="Department"
          :rules="[isRequired]"
        />
        <q-input
          v-model="formFields.position"
          label="Position"
          :rules="[isRequired]"
        /><q-input
          v-model="formFields.employeeID"
          label="Employee ID"
          :rules="[isRequired]"
          class="no-spinner"
          type="number"
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
import { TheWorkflows } from 'src/workflows/the-workflows';
import { uid, useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth.store';
import { IAdviserProfile, IProfile } from 'src/entities';

const authStore = useAuthStore();
const $q = useQuasar();
const adviserDialogVisible = ref(false);
const formFields = reactive({
  college: '',
  department: '',
  position: '',
  employeeID: '',
});

const isRequired = (val: string) => {
  if (!val) return 'Field is required!';
  return true;
};

const newData = computed(() => {
  return {
    ...(authStore.currentUser as IProfile),
    type: 'adviser',
    college: formFields.college,
    department: formFields.department,
    position: formFields.position,
    employeeID: formFields.employeeID,
  } as IAdviserProfile;
});
const succesCb = ref<VoidCallback>();
TheDialogs.on({
  type: 'adviserApplicationDialog',
  cb(e) {
    adviserDialogVisible.value = true;
    succesCb.value = e.success;
  },
});

function resetFormFields() {
  formFields.college = '';
  formFields.department = '';
  formFields.position = '';
  formFields.employeeID = '';
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
        $q.notify('Adviser application was successful.');
        resetFormFields();
        adviserDialogVisible.value = false;
        succesCb.value && succesCb.value();
      },
      error: (err) => {
        $q.notify({
          message: String(err),
          icon: 'error',
          color: 'negative',
          caption: 'Adviser application failed.',
        });
      },
    },
  });
}
</script>
