<template>
  <q-page class="q-ma-md">
    <DataTable />
  </q-page>
</template>

<script setup>
import DataTable from 'src/components/admin/DataTable.vue';
</script>

<style scoped>
.text-right {
  text-align: right;
}

.bg-primary {
  background-color: var(--q-color-primary);
}
</style>
