<template>
  <div class="flex justify-center">
    <q-btn
      round
      flat
      color="green"
      class="q-mx-sm"
      icon="check"
      @click="viewApplication"
    >
      <q-tooltip>Approve</q-tooltip>
    </q-btn>
    <q-btn
      round
      flat
      color="red"
      icon="close"
      class="q-mx-sm"
      @click="rejectApplication"
    >
      <q-tooltip>Reject</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import { TheDialogs } from 'src/dialogs/the-dialogs';
import { TheWorkflows } from 'src/workflows/the-workflows';
import { Notify } from 'quasar';

const props = defineProps({
  props: Object,
});

function viewApplication() {
  TheDialogs.emit({
    type: 'viewStudentApplicationDialog',
    arg: {
      payload: props.props,
    },
  });
}

function rejectApplication() {
  TheDialogs.emit({
    type: 'applicationRejectDialog',
    arg: {
      payload: props.props,
    },
  });
}
</script>
