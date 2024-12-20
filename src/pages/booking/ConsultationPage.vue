<template>
  <q-page view="lHh lpr lFf" container class="shadow-2 rounded-borders q-pa-sm">
    <q-table
      :rows="consultations"
      :columns="columns"
      row-key="id"
      :pagination="{ rowsPerPage: 50 }"
    >
      <template #top-right>
        <q-chip>
          {{ dateRange.from }}
        </q-chip>
        -
        <q-chip>
          {{ dateRange.to }}
        </q-chip>
        <q-btn dense rounded icon="filter_alt">
          <q-popup-proxy>
            <q-date v-model="dateRange" range>
              <q-btn
                class="float-right"
                v-close-popup
                icon="check"
                @click="loadConsulations"
              ></q-btn>
            </q-date>
          </q-popup-proxy>
        </q-btn>
      </template>
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
      <template v-slot:body-cell-student="props">
        <q-td :props="props" class="text-left">
          <q-avatar><q-img :src="props.row.advisee.avatar" /></q-avatar>
          {{ props.row.advisee.fullName }}
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props" class="text-center">
          <q-chip
            class="text-uppercase"
            :class="'bg-' + statusColor(props.value)"
            >{{ props.row.status }}</q-chip
          >
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-right">
          <q-btn
            color="green"
            class="q-mx-sm"
            :disable="props.row.status !== 'pending'"
            @click="approveConsulation(props.row)"
            >Approve</q-btn
          >
          <q-btn
            color="red"
            class="q-mx-sm"
            :disable="props.row.status !== 'pending'"
            @click="rejectConsulation(props.row)"
            >Reject</q-btn
          >
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { date, QTableColumn } from 'quasar';
import { useBookingStore } from 'src/stores/booking.store';
import { useAuthStore } from 'src/stores/auth.store';
import { approveConsulation, rejectConsulation, statusColor } from './helper';

const bookingStore = useBookingStore();
const authStore = useAuthStore();
const consultations = computed(() => {
  return bookingStore.consulations;
});
const dateRange = ref({
  from: date.formatDate(new Date(), 'YYYY-MM-DD'),
  to: date.formatDate(new Date(), 'YYYY-MM-DD'),
});

const columns = [
  {
    name: 'student',
    required: true,
    label: 'Student',
    align: 'left',
    field: 'advisee',
  },
  {
    name: 'date',
    label: 'Date',
    align: 'center',
    field: 'date',
  },
  {
    name: 'description',
    label: 'Description',
    align: 'left',
    field: 'description',
  },
  {
    name: 'status',
    label: 'Status',
    align: 'center',
    field: 'status',
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
let sub: ReturnType<typeof bookingStore.streamConsulationsWith> | undefined;
onMounted(() => {
  loadConsulations();
});

function loadConsulations() {
  sub?.unsubscribe();
  sub = bookingStore.streamConsulationsWith({
    adviser: authStore.currentUser?.key,
    // 'date <=': date.formatDate(dateRange.value.from, 'YYYY-MM-DD'),
    // 'date <=': date.formatDate(dateRange.value.to, 'YYYY-MM-DD'),
  });
}
onUnmounted(() => {
  sub?.unsubscribe();
});
</script>
