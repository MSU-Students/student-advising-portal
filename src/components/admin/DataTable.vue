<template>
  <q-table :rows="applications" :columns="columns" row-key="id" hide-bottom>
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
      <ActionButtons :props="props" />
    </template>
  </q-table>
</template>

<script setup>
import { ref } from 'vue';
import ActionButtons from './ActionButtons.vue';

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
