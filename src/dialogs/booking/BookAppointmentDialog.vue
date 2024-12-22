<template>
  <q-dialog v-model="showDialog">
    <q-card style="min-width: 300px" class="rounded-borders">
      <q-card-section class="text-center bg-primary text-white">
        <span class="text-h6 q-ml-sm q-pa-xl text-bold"
          >Booking
          <span class="text-capitalize">{{ newBooking?.type }}</span>
        </span>
      </q-card-section>

      <q-card v-if="newBooking && isBookingAppear">
        <q-form @submit="onSubmit" class="q-px-md q-py-sm">
          <q-card-section>
            <q-option-group
              @update:model-value="onChangeBookingType"
              v-model="newBooking.type"
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
          <q-card-section v-if="newBooking.type == 'consultation'" class="row">
            <q-select
              class="col"
              v-model="newBooking.advisee"
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
              v-model="newBooking.adviser"
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
          <q-card-section v-if="newBooking.type == 'appointment'">
            <q-select
              v-model="newBooking.invited"
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
              v-model="newBooking.title"
              :rules="[(v) => v.length || 'Title is required']"
            />
            <div class="text-subtitle1 text-primary">Description</div>
            <q-input
              v-model="newBooking.description"
              type="textarea"
              placeholder="Type here..."
              dense
              autogrow
              :rules="[
                (v) =>
                  v.length ||
                  'State purpose or description of ' + newBooking?.type,
              ]"
            />
          </q-card-section>
          <q-card-section>
            <div class="text-subtitle1 text-primary">Date</div>
            <q-input
              dense
              label="Date"
              v-model="newBooking.date"
              :rules="['date']"
            >
              <template #append>
                <q-btn round flat icon="today">
                  <q-popup-proxy>
                    <q-date v-model="newBooking.date" />
                  </q-popup-proxy>
                </q-btn>
              </template>
              <template #after>
                <q-chip clickable>
                  <q-icon name="watch" />
                  {{ newBooking.time || 'time' }}
                  <q-popup-proxy>
                    <q-time v-model="newBooking.time">
                      <q-btn v-close-popup>Set</q-btn>
                    </q-time>
                  </q-popup-proxy>
                </q-chip>
                <q-chip clickable>
                  <q-icon name="schedule" />
                  {{ newBooking.duration || 'duration' }}
                  <q-popup-proxy @before-hide="setDuration()">
                    <q-time v-model="newBooking.duration" format24h>
                      <q-btn v-close-popup @click="setDuration()">Set</q-btn>
                    </q-time>
                  </q-popup-proxy>
                </q-chip>
              </template>
            </q-input>
            <q-input label="Location" v-model="newBooking.location" />
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
const newBooking = ref<IBooking>();
type SuccessCb = (booking: IBooking) => void;
const successCb = ref<SuccessCb>();

function onSubmit() {
  if (!newBooking.value) return;
  TheWorkflows.emit({
    type: 'bookAppointment',
    arg: {
      payload: newBooking.value,
      success(booking) {
        if (successCb.value) {
          successCb.value(booking);
        }
        showDialog.value = false;
      },
    },
  });
}
function setDuration() {
  if (newBooking.value) {
    const [hrStr, minStr] = (newBooking.value.duration || '1:00').split(':');
    const hr = Number(hrStr);
    const min = Number(minStr);
    newBooking.value.duration = `${hr}h` + (min ? ` ${min}m` : '');
  }
}
TheDialogs.on({
  type: 'bookAppointmentDialog',
  async cb(e) {
    successCb.value = e.success;
    showDialog.value = true;
    const user = await authStore.getUser();
    newBooking.value = {
      type: 'consultation',
      bookedBy: { ...user } as IProfile,
      date: date.formatDate(e.payload?.date || new Date(), 'YYYY/MM/DD'),
      time: e.payload?.time || '08:00',
      status: 'pending',
      location: '',
      description: '',
      advisee: undefined as unknown as IStudentProfile,
      adviser: undefined as unknown as IAdviserProfile,
      title: '',
    };
    onChangeBookingType();
  },
});
function onChangeBookingType() {
  if (
    newBooking.value?.type == 'consultation' &&
    typeof newBooking.value.bookedBy == 'object'
  ) {
    if (newBooking.value.bookedBy.type == 'student') {
      newBooking.value.advisee = newBooking.value.bookedBy;
    }
    if (newBooking.value.bookedBy.type == 'adviser') {
      newBooking.value.adviser = newBooking.value.bookedBy;
    }
  } else if (
    newBooking.value?.type == 'appointment' &&
    typeof newBooking.value.bookedBy == 'object'
  ) {
    newBooking.value.invited = [];
    newBooking.value.invited.push(newBooking.value.bookedBy);
  }
}
</script>
