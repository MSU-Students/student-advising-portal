<template>
  <q-dialog>
    <q-table
    v-if="isBookingAppear"
    :rows="bookings"
    :columns="columns"
    class="q-pa-md q-gutter-sm"
  >
    <template #top-right>
      <q-btn
        @click="bookAppointment"
        class="bg-primary text-white"
        style="margin-right: 10px"
        >Book</q-btn
      >
      <q-btn
        class="bg-red close-btn text-white"
        @click="disappearBookingDialog"
      >
        <!-- <q-icon name="close" color="white" /> -->CANCEL
      </q-btn>
    </template>
  </q-table>
  </q-dialog>
</template>

<script>
import { QTableColumn } from 'quasar';
import { TheDialogs } from 'src/dialogs/the-dialogs';
import { IBooking } from 'src/entities';
import { useBookingStore } from 'src/stores/booking.store';
import { computed, onMounted, ref } from 'vue';

const bookingStore = useBookingStore();
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
      `${typeof row.author == 'object' ? row.author.fullName : ''}`,
  },
] as QTableColumn[];

function bookAppointment() {
  TheDialogs.emit({
    type: 'bookAppointmentDialog',
    arg: {
      success(booking) {
        console.log(booking);
      },
    },
  });
}
onMounted(() => {
  bookingStore.streamWith();
});

</script>
