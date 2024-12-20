<template>
  <q-dialog v-model="showDialog">
    <q-card style="min-width: 300px" class="rounded-borders">
      <q-card-section class="text-center bg-primary text-white">
        <span class="text-h6 q-ml-sm q-pa-xl text-bold"
          >Booking
          <span class="text-capitalize">{{ booking?.type }}</span>
        </span>
      </q-card-section>

      <q-card v-if="booking && isBookingAppear">
        <q-form @submit="onSubmit" class="q-px-md q-py-sm">
          <q-card-section>
            <q-option-group
              @update:model-value="onChangeBookingType"
              v-model="booking.type"
              inline
              :options="[
                {
                  value: 'consultation',
                  label: 'Consultation',
                },
                {
                  value: 'appointment',
                  label: 'Appointment',
                },
              ]"
            >
            </q-option-group>
          </q-card-section>
          <q-card-section v-if="booking.type == 'consultation'" class="row">
            <q-select
              class="col"
              v-model="booking.advisee"
              use-input
              label="Advisee"
              option-label="fullName"
              @input-value="(v) => searchStudents(v)"
              :options="profileOptions"
              :loading="loading"
              :rules="[(v) => v || 'Select Advisee']"
            >
            </q-select>
            <q-select
              class="col"
              v-model="booking.adviser"
              use-input
              label="Adviser"
              option-label="fullName"
              @input-value="(v) => searchAdvisers(v)"
              :options="profileOptions"
              :loading="loading"
              :rules="[(v) => v || 'Select Adviser']"
            >
            </q-select>
          </q-card-section>
          <q-card-section v-if="booking.type == 'appointment'">
            <q-select
              v-model="booking.invited"
              use-input
              label="Invited"
              use-chips
              multiple
              option-label="fullName"
              @input-value="(v) => searchAttendees(v)"
              :options="profileOptions"
              :loading="loading"
              :rules="[(v) => v?.length || 'Invite Attendees']"
            >
            </q-select>
          </q-card-section>
          <q-card-section class="q-mt-md">
            <q-input
              label="Title"
              v-model="booking.title"
              :rules="[(v) => v.length || 'Title is required']"
            />
            <div class="text-subtitle1 text-primary">Description</div>
            <q-input
              v-model="booking.description"
              type="textarea"
              placeholder="Type here..."
              dense
              autogrow
              :rules="[
                (v) =>
                  v.length ||
                  'State purpose or description of ' + booking?.type,
              ]"
            />
          </q-card-section>
          <q-card-section>
            <div class="text-subtitle1 text-primary">Date</div>
            <q-input
              dense
              label="Date"
              v-model="booking.date"
              :rules="['date']"
            >
              <template #append>
                <q-btn round flat icon="today">
                  <q-popup-proxy>
                    <q-date v-model="booking.date" />
                  </q-popup-proxy>
                </q-btn>
              </template>
              <template #after>
                <q-chip clickable>
                  <q-icon name="watch" />
                  {{ booking.time || 'time' }}
                  <q-popup-proxy>
                    <q-time v-model="booking.time">
                      <q-btn v-close-popup>Set</q-btn>
                    </q-time>
                  </q-popup-proxy>
                </q-chip>
              </template>
            </q-input>
            <q-input label="Location" v-model="booking.location" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn type="submit" color="primary">Book</q-btn>
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
import {
  IAdviserProfile,
  IBooking,
  IProfile,
  IStudentProfile,
} from 'src/entities';
import { TheWorkflows } from 'src/workflows/the-workflows';
import isBookingAppear from 'src/pages/booking/BookingPage.vue';
import { useAuthStore } from 'src/stores/auth.store';
import { date } from 'quasar';
import {
  loading,
  profileOptions,
  searchAdvisers,
  searchAttendees,
  searchStudents,
} from 'src/pages/booking/helper';

const authStore = useAuthStore();
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
  async cb(e) {
    successCb.value = e.success;
    showDialog.value = true;
    const user = await authStore.getUser();
    booking.value = {
      type: 'consultation',
      bookedBy: { ...user } as IProfile,
      date: date.formatDate(new Date(), 'YYYY/MM/DD'),
      time: '08:00',
      status: 'pending',
      location: '',
      description: '',
      advisee: undefined as unknown as IStudentProfile,
      adviser: undefined as unknown as IAdviserProfile,
    };
    onChangeBookingType();
  },
});
function onChangeBookingType() {
  if (
    booking.value.type == 'consultation' &&
    typeof booking.value.bookedBy == 'object'
  ) {
    if (booking.value.bookedBy.type == 'student') {
      booking.value.advisee = booking.value.bookedBy;
    }
    if (booking.value.bookedBy.type == 'adviser') {
      booking.value.adviser = booking.value.bookedBy;
    }
  } else if (
    booking.value.type == 'appointment' &&
    typeof booking.value.bookedBy == 'object'
  ) {
    booking.value.invited = [];
    booking.value.invited.push(booking.value.bookedBy);
  }
}
</script>
