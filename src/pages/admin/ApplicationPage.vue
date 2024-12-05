<template>
  <q-page>
    <q-card class="q-ma-md" bordered flat>
      <q-card-section>
        <Toolbar />

        <q-tabs v-model="tab" dense active-color="primary">
          <q-route-tab to="student" label="Student" />
          <q-route-tab to="adviser" label="Adviser" />
          <q-route-tab to="admin" label="Admin" />
        </q-tabs>
        <q-tab-panel v-model="tab">
          <!-- <DataTable /> -->
          <q-card class="q-pa-md" bordered flat>
            <router-view />
          </q-card>
        </q-tab-panel>
      </q-card-section>
    </q-card>
    <!-- <router-view /> -->
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
