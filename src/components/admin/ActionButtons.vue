<template>
  <q-td :props="props" class="text-right">
    <q-btn color="green" class="q-mx-sm">Approve</q-btn>
    <q-btn color="red" class="q-mx-sm">Reject</q-btn>
  </q-td>
</template>

<script setup>
defineProps({
  props: Object,
});
</script>
