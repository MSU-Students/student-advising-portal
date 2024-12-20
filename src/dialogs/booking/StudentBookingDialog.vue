<template>
  <q-dialog v-model="studentBookingClick">
    <q-table :rows="bookings" :columns="columns" class="q-pa-md q-gutter-sm">
      <template #top-right>
        <q-btn
          @click="bookAppointment"
          class="bg-primary text-white"
          style="margin-right: 10px"
          >Book</q-btn
        >
        <q-btn class="bg-red close-btn text-white" v-close-popup>
          CANCEL
        </q-btn>
      </template>
    </q-table>
  </q-dialog>
</template>

<script setup lang="ts">
import { TheDialogs } from '../the-dialogs';
import { QTableColumn } from 'quasar';
import { computed, ref } from 'vue';
import { IBooking } from 'src/entities';
import { useBookingStore } from 'src/stores/booking.store';
const bookingStore = useBookingStore();
// Define reactive variables

const studentBookingClick = ref(false);

TheDialogs.on({
  type: 'studentBookingDialog',
  cb(e) {
    studentBookingClick.value = true;
    console.log(e);
  },
});

const bookings = computed(() => {
  return bookingStore.bookings;
});
const columns = [
  {
    name: 'date',
    label: 'Date',
    field: 'date',
  },
  {
    name: 'location',
    label: 'Location',
    field: 'location',
  },
  {
    author: 'author',
    label: 'Author',
    field: (row: IBooking) =>
      `${typeof row.bookedBy == 'object' ? row.bookedBy.fullName : ''}`,
  },
] as QTableColumn[];

function bookAppointment() {
  TheDialogs.emit({
    type: 'bookAppointmentDialog',
    arg: {
      success() {
        console.log();
      },
    },
  });
}
</script>
