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
          @click="confirmStudent"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { TheDialogs } from 'src/dialogs/the-dialogs';

const studentAdminDialog = ref(false);
const formFields = reactive({
  idNumber: '',
  program: '',
});

TheDialogs.on({
  type: 'studentApplicationDialog',
  cb() {
    studentAdminDialog.value = true;
  },
});

function confirmStudent() {
  console.log('Student confirmed');
  studentAdminDialog.value = false;
}
</script>
