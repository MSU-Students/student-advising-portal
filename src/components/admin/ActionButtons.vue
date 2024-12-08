<template>
  <div class="flex justify-center">
    <q-btn round flat color="green" class="q-mx-sm" icon="check">
      <q-tooltip>Approve</q-tooltip>
    </q-btn>
    <q-btn
      round
      flat
      color="red"
      icon="close"
      class="q-mx-sm"
      @click="TheDialogs.emit({ type: 'applicationRejectDialog', arg: {} })"
    >
      <q-tooltip>Reject</q-tooltip>
    </q-btn>
    <q-btn round flat icon="more_horiz">
      <q-tooltip>View Application</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import { TheDialogs } from 'src/dialogs/the-dialogs';

defineProps({
  props: Object,
});
</script>
