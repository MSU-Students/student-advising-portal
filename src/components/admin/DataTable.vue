<template>
  <q-table :rows="applications" :columns="columns" row-key="id" hide-bottom>
  </q-table>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRequestStore } from 'src/stores/request.store';
import { IRequest, IProfile } from 'src/entities';
import { date, Notify, QTableColumn } from 'quasar';
import { TheDialogs } from 'src/dialogs/the-dialogs';
import { TheWorkflows } from 'src/workflows/the-workflows';

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

function approveApplication(request: IRequest) {
  Notify.create({
    message: 'Are you sure?',
    position: 'center',
    actions: [
      {
        name: 'yes',
        label: 'yes',
        handler() {
          TheWorkflows.emit({
            type: 'approveApplication',
            arg: {
              payload: { ...request, data: { ...request.data } },
            },
          });
        },
      },
      {
        label: 'No',
      },
    ],
  });
}

const onRowClick = (row: IRequest) => {
  alert(`${row.data.fullName} clicked`);
};
</script>
