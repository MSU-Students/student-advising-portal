<template>
  <q-dialog v-model="showDialog">
    <q-card v-if="booking && isBookingAppear">
      <q-form @submit="onSubmit">
        <q-card-section>
          <q-input v-model="booking.date" :rules="['date']">
            <template #append>
              <q-btn round dense icon="today">
                <q-popup-proxy>
                  <q-date v-model="booking.date" />
                </q-popup-proxy>
              </q-btn>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions>
          <q-btn type="submit" class="bg-primary text-white">Submit</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { TheDialogs } from '../the-dialogs';
import { IBooking } from 'src/entities';
import { TheWorkflows } from 'src/workflows/the-workflows';
import isBookingAppear from 'src/pages/booking/BookingPage.vue';

const showDialog = ref(false);
const booking = ref<IBooking>();
type SuccessCb = (booking: IBooking) => void;
const successCb = ref<SuccessCb>();

function onSubmit() {
  if (!booking.value) return;
  TheWorkflows.emit({
    type: 'bookAppointment',
    arg: {
      payload: booking.value,
      success(booking) {
        if (successCb.value) {
          successCb.value(booking);
        }
        showDialog.value = false;
      },
    },
  });
}
TheDialogs.on({
  type: 'bookAppointmentDialog',
  cb(e) {
    successCb.value = e.success;
    showDialog.value = true;
    booking.value = {
      type: 'appointment',
      author: {
        type: 'student',
        avatar: '',
        fullName: 'Test',
        idNumber: '123',
        program: 'BSCS',
      },
      accepted: [],
      attendees: [],
      date: 'Date',
      invited: [],
      status: 'pending',
      time: 'now',
      location: 'here',
    };
  },
});
</script>
