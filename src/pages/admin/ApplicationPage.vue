<template>
  <q-page>
    <q-card class="q-pa-md">
      <q-card-section>
        <Toolbar />
      </q-card-section>

      <q-card-section>
        <q-tabs v-model="tab">
          <q-tab name="student">Student</q-tab>
          <q-tab name="adviser">Adviser</q-tab>
          <q-tab name="admin">Admin</q-tab>
        </q-tabs>
        <q-tab-panel v-model="tab">
          <q-tab-panel name="student">
            <!-- <DataTable /> -->
            <router-view />
          </q-tab-panel>
        </q-tab-panel>
      </q-card-section>
    </q-card>
    <router-view />
  </q-page>
</template>

<script setup>
import Toolbar from 'src/components/admin/Toolbar.vue';
import { ref } from 'vue';
const tab = ref('student');
</script>

<style scoped>
.text-right {
  text-align: right;
}

.bg-primary {
  background-color: var(--q-color-primary);
}
</style>
