<template>
  <q-page>
    <q-card class="q-pa-md">
      <q-card-section>
        <Toolbar />
      </q-card-section>

      <q-card-section>
        <DataTable />
      </q-card-section>
    </q-card>
    <router-view />
  </q-page>
</template>

<script setup>
import Toolbar from 'src/components/admin/Toolbar.vue';
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
