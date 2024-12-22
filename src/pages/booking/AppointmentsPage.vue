<template>
  <q-page view="lHh lpr lFf" container class="shadow-2 rounded-borders q-pa-sm">
    <q-table
      :rows="appointments"
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
                @click="loadAppointments"
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
      <template v-slot:body-cell-bookedby="props">
        <q-td :props="props" class="text-left">
          <q-avatar><q-img :src="props.row.bookedBy.avatar" /></q-avatar>
          {{ props.row.bookedBy.fullName }}
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props" class="text-center">
          <q-chip class="text-uppercase" :color="statusColor(props.value)">{{
            props.row.status
          }}</q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-invitations="props">
        <q-td :props="props" class="text-center">
          <q-chip class="text-uppercase">{{ props.value }}</q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-right">
          <q-btn
            color="green"
            class="q-mx-sm"
            :disable="props.row.status !== 'pending'"
            @click="joinAppointment(props.row)"
            >Approve</q-btn
          >
          <q-btn
            color="red"
            class="q-mx-sm"
            :disable="props.row.status !== 'pending'"
            @click="rejectAppointment(props.row)"
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
import { IAppointmentBooking, IConsultationBooking } from 'src/entities';
import { statusColor } from './helper';

const bookingStore = useBookingStore();
const authStore = useAuthStore();
const appointments = computed(() => {
  return bookingStore.appointments;
});
const dateRange = ref({
  from: date.formatDate(new Date(), 'YYYY-MM-DD'),
  to: date.formatDate(new Date(), 'YYYY-MM-DD'),
});

const columns = [
  {
    name: 'bookedby',
    required: true,
    label: 'Booked By',
    align: 'left',
    field: 'bookedBy',
  },
  {
    name: 'date',
    label: 'Date',
    align: 'center',
    field: (row: IAppointmentBooking) => `${row.date}  ${row.time}`,
  },
  {
    name: 'description',
    label: 'Description',
    align: 'left',
    field: 'description',
  },
  {
    name: 'invitations',
    label: 'Invitations',
    align: 'left',
    field: (row: IAppointmentBooking) => row.invited?.length || 0,
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
  loadAppointments();
});

function loadAppointments() {
  sub?.unsubscribe();
  sub = bookingStore.streamAppointmentsWith({
    'invited array-contains': authStore.currentUser?.key,
    // 'date >=': date.formatDate(dateRange.value.from, 'YYYY-MM-DD'),
    // 'date <=': date.formatDate(dateRange.value.to, 'YYYY-MM-DD'),
  });
}
onUnmounted(() => {
  sub?.unsubscribe();
});

function joinAppointment(booking: IConsultationBooking) {
  console.log(booking);
}
function rejectAppointment(booking: IConsultationBooking) {
  console.log(booking);
}
</script>
