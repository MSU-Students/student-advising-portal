<template>
  <q-dialog v-model="adviserDialogVisible" persistent>
    <q-card style="min-width: 300px">
      <q-card-section class="bg-primary text-white row items-center">
        <q-avatar
          icon="admin_panel_settings"
          color="white"
          text-color="primary"
          size="md"
        />
        <span class="text-h6 q-ml-sm">Adviser Confirmation</span>
      </q-card-section>

      <q-card-section class="q-pt-md">
        <span>Do you want to proceed as Adviser?</span>
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-1">
        <q-btn flat label="Cancel" color="dark" v-close-popup icon="close" />
        <q-btn
          flat
          label="Confirm"
          color="primary"
          icon="check_circle"
          @click="confirmAdviser"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { TheDialogs } from 'src/dialogs/the-dialogs';

const adviserDialogVisible = ref(false);

TheDialogs.on({
  type: 'adviserDialog',
  cb() {
    adviserDialogVisible.value = true;
  },
});

function confirmAdviser() {
  console.log('Adviser confirmed');
  adviserDialogVisible.value = false;
}
</script>
