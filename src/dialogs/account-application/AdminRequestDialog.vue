<template>
  <q-dialog v-model="adminDialogVisible">
    <q-card style="min-width: 300px; border-radius: 22px">
      <q-card-section class="text-center bg-primary text-white">
        <span class="text-h6 q-ml-sm q-pa-xl text-bold"
          >ADMIN CONFIRMATION</span
        >
      </q-card-section>

      <q-card-section class="q-pt-md">
        <span>Do you want to proceed as Admin?</span>
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
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { TheDialogs } from 'src/dialogs/the-dialogs';
import { TheWorkflows } from 'src/workflows/the-workflows';
import { uid, useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth.store';
import { IAdminProfile, IProfile } from 'src/entities';

const authStore = useAuthStore();
const adminDialogVisible = ref(false);
const $q = useQuasar();

const newData = computed(() => {
  return {
    ...(authStore.currentUser as IProfile),
    type: 'admin',
  } as IAdminProfile;
});
const succesCb = ref<VoidCallback>();
TheDialogs.on({
  type: 'adminApplicationDialog',
  cb(e) {
    adminDialogVisible.value = true;
    succesCb.value = e.success;
  },
});

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
        $q.notify('Admin application was successful.');
        adminDialogVisible.value = false;
        succesCb.value && succesCb.value();
      },
      error: (err) => {
        console.log(err);
      },
    },
  });
}
</script>
