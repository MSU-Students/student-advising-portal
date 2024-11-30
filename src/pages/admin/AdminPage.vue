<template>
  <q-page>
    <q-card class="q-pa-md">
      <q-card-section>
        <q-toolbar>
          <q-toolbar-title class="text-h5">Dashboard Menu</q-toolbar-title>
          <q-space />
          <q-btn-dropdown label="Filter" color="primary" class="q-ml-sm">
            <q-list>
              <q-item clickable v-ripple>
                <q-item-section>Approved</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>Denied</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>Pending</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-toolbar>
      </q-card-section>
      <q-card-section>
        <q-table
          :rows="applications"
          :columns="columns"
          row-key="id"
          hide-bottom
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="bg-primary text-white"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-right">
              <q-btn color="green" class="q-mx-sm">Approve</q-btn>
              <q-btn color="red" class="q-mx-sm">Reject</q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

const applications = ref([
  {
    id: 1,
    application: 'Application 1',
    applicant: 'John Doe',
    role: 'Student',
    createdAt: '2023-11-26 10:30',
  },
  {
    id: 2,
    application: 'Application 2',
    applicant: 'Jane Smith',
    role: 'Faculty',
    createdAt: '2023-11-26 11:00',
  },
  {
    id: 3,
    application: 'Application 3',
    applicant: 'Alice Johnson',
    role: 'Admin',
    createdAt: '2023-11-26 11:30',
  },
]);

const columns = [
  {
    name: 'application',
    required: true,
    label: 'Application',
    align: 'center',
    field: 'application',
  },
  {
    name: 'applicant',
    required: true,
    label: 'Applicant',
    align: 'center',
    field: 'applicant',
  },
  {
    name: 'role',
    required: true,
    label: 'Role',
    align: 'center',
    field: 'role',
  },
  {
    name: 'createdAt',
    required: true,
    label: 'Created At',
    align: 'center',
    field: 'createdAt',
  },
  {
    name: 'actions',
    required: true,
    label: 'Actions',
    align: 'center',
    field: 'actions',
    style: 'width: 1px;',
  },
];
</script>

<style scoped>
.text-right {
  text-align: right;
}

.bg-primary {
  background-color: var(--q-color-primary);
}
</style>
