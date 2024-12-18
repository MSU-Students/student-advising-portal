<template>
  <q-dialog v-model="showDialog">
    <q-card style="min-width: 300px" class="rounded-borders">
      <q-card-section class="text-center bg-primary text-white">
        <span class="text-h6 q-ml-sm q-pa-xl text-bold">Booking Details</span>
      </q-card-section>

      <q-card v-if="booking && isBookingAppear">
        <q-form @submit="onSubmit" class="q-px-md q-py-sm">
          <q-card-section class="q-mt-md">
            <div class="text-subtitle1 text-primary">Purpose</div>
            <q-input
              v-model="text"
              type="textarea"
              placeholder="Type here..."
              dense
              autogrow
            />
          </q-card-section>
          <q-card-section>
            <div class="text-subtitle1 text-primary">Date</div>
            <q-input v-model="booking.date" :rules="['date']">
              <template #append>
                <q-btn round flat icon="today">
                  <q-popup-proxy>
                    <q-date v-model="booking.date" />
                  </q-popup-proxy>
                </q-btn>
              </template>
            </q-input>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn type="submit" color="primary">Submit</q-btn>
            <q-btn flat round color="negative" icon="close" v-close-popup />
          </q-card-actions>
        </q-form>
      </q-card>
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
const text = ref('');

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
        text.value = '';
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
      date: new Date().toISOString().split('T')[0].replaceAll('-', '/'),
      invited: [],
      status: 'pending',
      time: 'now',
      location: 'here',
    };
  },
});
</script>
