<template>
  <q-table
    flat
    bordered
    separator="vertical"
    :rows="applications"
    :columns="columns"
  >
    <template #header>
      <q-tr class="bg-primary text-white">
        <q-th v-for="col in columns" :key="col.name">{{ col.label }}</q-th>
      </q-tr>
    </template>
    <template #body="prop">
      <q-tr>
        <!-- application status -->
        <q-td>
          <div class="flex justify-center items-center">
            <q-icon
              :name="prop.row.status == 'pending' ? 'autorenew' : ''"
              color="orange"
              size="md"
            />
            <span class="text-weight-bolder text-orange">{{
              prop.row.status == 'pending' ? 'PENDING' : ''
            }}</span>
          </div>
        </q-td>
        <!-- applicant name -->
        <q-td>
          {{ prop.row.data.fullName }}
        </q-td>
        <!-- applicant role -->
        <q-td>
          {{ prop.row.data.type }}
        </q-td>
        <!-- application creation time -->
        <q-td>
          {{ date.formatDate(prop.row.createdAt, 'MMM DD YYYY hh:mm A') }}
        </q-td>
        <!-- application actions -->
        <q-td>
          <ActionButtons :props="prop.row" />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRequestStore } from 'src/stores/request.store';
import { IRequest, IProfile } from 'src/entities';
import { date, QTableColumn } from 'quasar';

import ActionButtons from './ActionButtons.vue';

const props = defineProps<{
  type: IProfile['type'];
}>();

const requestStore = useRequestStore();

const applications = computed(() => {
  return requestStore.requests;
});

const filter = ref<IRequest['status']>('pending');

// const filterOptions = [
//   {
//     label: 'Pending',
//     value: 'pending',
//   },
//   {
//     label: 'Approved',
//     value: 'approved',
//   },
//   {
//     label: 'Rejected',
//     value: 'rejected',
//   },
// ] as { label: string; value: IRequest['status'] }[];

const columns = [
  {
    name: 'application',
    required: true,
    label: 'Application',
    align: 'center',
    field: (row: IRequest) => row.status,
  },
  {
    name: 'applicant',
    required: true,
    label: 'Applicant',
    align: 'center',
    field: (row: IRequest) => `${row.data.fullName}`,
  },
  {
    name: 'role',
    required: true,
    label: 'Role',
    align: 'center',
    field: (row: IRequest) => row.data.type,
  },
  {
    name: 'createdAt',
    required: true,
    label: 'Created At',
    align: 'center',
    field: (row: IRequest) =>
      date.formatDate(row.createdAt, 'MMM DD YYYY hh:mm A'),
  },
  {
    name: 'actions',
    required: true,
    label: 'Actions',
    align: 'center',
    field: 'actions',
    style: 'width: 1px;',
  },
] as QTableColumn[];

let sub: ReturnType<typeof requestStore.streamRequests> | undefined;
onMounted(() => {
  updateFilter();
});

function updateFilter() {
  sub?.unsubscribe();
  sub = requestStore.streamRequests({
    'status ==': filter.value,
    'data.type': props.type,
  });
}

onUnmounted(() => {
  sub?.unsubscribe();
});
</script>
