<template>
  <div class="row justify-end q-gutter-sm q-pa-sm">
    <q-select
      outlined
      rounded
      dense
      stack-label
      label="Application Type"
      v-model="typeFilter"
      :options="typeOptions"
      @update:model-value="handleTypeSelect"
      class="col"
    />
    <q-select
      outlined
      rounded
      dense
      stack-label
      label="Application Status"
      v-model="statusFilter"
      :options="statusOptions"
      @update:model-value="updateFilter"
      class="col"
    />
  </div>
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
              :name="
                statusOptions.find((s) => s.value == prop.row.status)?.icon
              "
              :color="
                statusOptions.find((s) => s.value == prop.row.status)?.color
              "
              size="md"
            />
            <span
              :class="[
                'text-weight-bolder',
                'text-' +
                  statusOptions.find((s) => s.value == prop.row.status)?.color,
              ]"
              >{{
                statusOptions
                  .find((s) => s.value == prop.row.status)
                  ?.label.toUpperCase()
              }}</span
            >
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
          <div class="flex justify-center">
            <q-btn
              round
              flat
              color="positive"
              icon="check"
              class="q-mx-sm"
              @click="viewApplication(prop.row)"
            >
              <q-tooltip>Approve</q-tooltip>
            </q-btn>
            <q-btn
              round
              flat
              color="negative"
              icon="close"
              class="q-mx-sm"
              @click="rejectApplication(prop.row)"
            >
              <q-tooltip>Reject</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRequestStore } from 'src/stores/request.store';
import { IRequest } from 'src/entities';
import { date, QTableColumn } from 'quasar';

import { TheDialogs } from 'src/dialogs/the-dialogs';
import { RouteLocationRaw, useRoute, useRouter } from 'vue-router';
import { update } from 'firebase/database';

const $router = useRouter();
const $route = useRoute();
// const props = defineProps<{ type: IProfile['type'] }>();
const requestStore = useRequestStore();
const applications = computed(() => {
  return requestStore.requests;
});

interface filterOption {
  label: string;
  value: string;
  to?: string;
  icon?: string;
  color?: string;
}

const routePath = $route.path.split('/')[2];
const typeOptions: filterOption[] = [
  {
    label: 'Admin',
    value: 'admin',
    to: 'admin',
  },
  {
    label: 'Adviser',
    value: 'adviser',
    to: 'adviser',
  },
  {
    label: 'Student',
    value: 'student',
    to: 'student',
  },
];
const typeFilter = ref(
  typeOptions.find((typeOption) => typeOption.value == routePath)
);

const statusOptions: filterOption[] = [
  {
    label: 'Pending',
    value: 'pending',
    icon: 'autorenew',
    color: 'orange',
  },
  {
    label: 'Approved',
    value: 'approved',
    icon: 'check',
    color: 'green',
  },
  {
    label: 'Rejected',
    value: 'rejected',
    icon: 'close',
    color: 'red',
  },
];
const statusFilter = ref(
  statusOptions.find((statusOption) => statusOption.value == 'pending')
);

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

const handleTypeSelect = (value: filterOption) => {
  $router.push(value.to as RouteLocationRaw);
};

let sub: ReturnType<typeof requestStore.streamRequests> | undefined;

function viewApplication(request: IRequest) {
  TheDialogs.emit({
    type: 'viewStudentApplicationDialog',
    arg: {
      payload: request,
    },
  });
}

function rejectApplication(request: IRequest) {
  TheDialogs.emit({
    type: 'applicationRejectDialog',
    arg: {
      payload: request,
    },
  });
}

function updateFilter() {
  sub?.unsubscribe();
  sub = requestStore.streamRequests({
    'status ==': statusFilter.value?.value as string,
    'data.type': typeFilter.value?.value as string,
  });
}

onMounted(() => {
  updateFilter();
});

onUnmounted(() => {
  sub?.unsubscribe();
});
</script>
