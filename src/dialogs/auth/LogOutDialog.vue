<template>
  <q-dialog v-model="logoutBtnClicked" persistent>
    <q-card style="min-width: 300px">
      <q-card-section class="bg-primary text-white row items-center">
        <q-avatar icon="logout" color="white" text-color="primary" size="md" />
        <span class="text-h6 q-ml-sm">Confirm Logout</span>
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div class="row items-center">
          <q-icon name="warning" color="warning" size="md" class="q-mr-sm" />
          <span>Are you sure you want to logout from the system?</span>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-1">
        <q-btn
          flat
          label="Cancel"
          color="dark"
          v-close-popup
          icon="close"
          class="q-px-md"
        />
        <q-btn
          flat
          label="Logout"
          color="negative"
          v-close-popup
          icon="logout"
          @click="onLogout()"
          class="q-px-md"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { TheDialogs } from '../the-dialogs';
import { TheWorkflows } from 'src/workflows/the-workflows';

const logoutBtnClicked = ref(false);
const successCb = ref<VoidCallback>();
TheDialogs.on({
  type: 'logoutDialog',
  cb(e) {
    logoutBtnClicked.value = true;
    successCb.value = e.success;
  },
});
function onLogout() {
  TheWorkflows.emit({
    type: 'logOut',
    arg: {
      success: () => {
        if (successCb.value) {
          successCb.value();
        }
      },
      error: (err) => {
        console.log(err);
      },
    },
  });
}
</script>
