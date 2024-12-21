<template>
  <q-page>
    <q-card style="min-width: 300px" class="rounded-borders">
      <q-card-section>
        <span class="text-h6 q-ml-sm text-bold"
          >Edit Booking
          <span class="text-capitalize">{{ booking?.type }}</span>
        </span>
      </q-card-section>
      <q-card>
        <q-form @submit="onSubmit" class="q-px-md q-py-sm" v-if="booking">
          <q-card-actions align="right">
            <q-btn rounded type="submit" :loading="busy" color="primary"
              >Save</q-btn
            >
            <q-btn rounded :to="{ name: 'calendar' }" color="primary"
              >Back</q-btn
            >
            <q-btn-dropdown rounded color="primary" label="More Action">
              <q-list>
                <q-item clickable v-close-popup v-if="ownBooking">
                  <q-item-section>
                    <q-item-label> Delete</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="cancelBooking">
                  <q-item-section>
                    <q-item-label> Cancel</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-card-actions>
          <q-card-section :horizontal="$q.screen.gt.sm">
            <q-card-section class="q-mt-md row">
              <q-input
                label="Title"
                class="col-12"
                v-model="booking.title"
                :rules="[(v) => v.length || 'Title is required']"
              />
              <q-input
                dense
                class="col-12"
                label="Date"
                v-model="booking.date"
                :rules="[(v) => date.isValid(v) || 'Enter Valid Date']"
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
                  <q-chip clickable>
                    <q-icon name="schedule" />
                    {{ booking.duration || 'duration' }}
                    <q-popup-proxy>
                      <q-time v-model="booking.duration" format24h>
                        <q-btn v-close-popup @click="setDuration()">Set</q-btn>
                      </q-time>
                    </q-popup-proxy>
                  </q-chip>
                </template>
              </q-input>
              <q-input
                class="col-12"
                label="Location"
                v-model="booking.location"
              />
              <div class="text-subtitle1 text-primary col-12">Description</div>
              <q-editor
                v-model="booking.description!"
                min-height="5rem"
                class="col-12"
              />
            </q-card-section>
            <q-card-section v-if="booking.type == 'consultation'">
              <div class="row items-start">
                <q-select
                  class="col-12"
                  v-model="booking.advisee"
                  use-input
                  dense
                  label="Advisee"
                  option-label="fullName"
                  @input-value="(v) => searchStudents(v)"
                  :options="profileOptions"
                  :loading="loading"
                  :rules="[(v) => v || 'Select Advisee']"
                >
                </q-select>
                <q-select
                  class="col-12"
                  v-model="booking.adviser"
                  use-input
                  dense
                  label="Adviser"
                  option-label="fullName"
                  @input-value="(v) => searchAdvisers(v)"
                  :options="profileOptions"
                  :loading="loading"
                  :rules="[(v) => v || 'Select Adviser']"
                >
                </q-select>
                <q-chip
                  class="text-uppercase col-12 q-ma-sm"
                  :class="'bg-' + statusColor(booking.status)"
                  >{{ booking.status }}</q-chip
                >
                <div
                  v-if="!ownBooking && isPartOfIt"
                  class="q-gutter-sm items-center row"
                >
                  <q-btn
                    icon="check"
                    rounded
                    @click="approveConsulation(booking)"
                    >Approve</q-btn
                  >
                  <q-btn
                    icon="close"
                    rounded
                    @click="rejectConsulation(booking)"
                    >Reject</q-btn
                  >
                </div>
              </div>
            </q-card-section>
            <q-card-section v-if="booking.type == 'appointment'" class="column">
              <q-select
                class="col-auto"
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
              <div
                v-if="!ownBooking && isPartOfIt"
                class="q-gutter-sm items-center col-auto row"
              >
                <q-btn icon="check" rounded>Joining</q-btn>
                <q-btn icon="close" rounded>Not Available</q-btn>
              </div>
            </q-card-section>
          </q-card-section>
          <div
            class="col column justify-end"
            v-if="typeof booking.bookedBy == 'object'"
          >
            <div class="text-subtitle2">Booked By:</div>
            <div>
              <q-avatar size="sm"
                ><q-img :src="booking.bookedBy.avatar"
              /></q-avatar>
              {{ booking.bookedBy.fullName }}
            </div>
          </div>
        </q-form>
      </q-card>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { IBooking } from 'src/entities';
import {
  approveConsulation,
  loading,
  profileOptions,
  rejectConsulation,
  searchAdvisers,
  searchAttendees,
  searchStudents,
  statusColor,
} from './helper';
import { useBookingStore } from 'src/stores/booking.store';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth.store';
import { TheWorkflows } from 'src/workflows/the-workflows';
import { date, Notify } from 'quasar';
const authStore = useAuthStore();
const bookingStore = useBookingStore();
const $route = useRoute();
const $router = useRouter();
const booking = ref<IBooking>();
onMounted(async () => {
  const bookingKey = $route.params.key as string;
  booking.value = await bookingStore.getBooking(bookingKey);
});
const ownBooking = computed(() => {
  return (
    typeof booking.value?.bookedBy == 'object' &&
    booking.value.bookedBy.key == authStore.currentUser?.key
  );
});
const isPartOfIt = computed(() => {
  if (booking.value?.type == 'consultation') {
    return (
      (typeof booking.value?.advisee == 'object' &&
        booking.value.advisee.key == authStore.currentUser?.key) ||
      (typeof booking.value?.adviser == 'object' &&
        booking.value.adviser.key == authStore.currentUser?.key)
    );
  } else if (booking.value?.type == 'appointment') {
    return !!booking.value.invited?.find(
      (i) => typeof i == 'object' && i.key == authStore.currentUser?.key
    );
  }
  return false;
});
const busy = ref(false);
function onSubmit() {
  if (!booking.value) return;
  busy.value = true;
  TheWorkflows.emit({
    type: 'updateBooking',
    arg: {
      payload: {
        booking: booking.value,
        fields:
          booking.value.type == 'appointment'
            ? [
                'date',
                'time',
                'title',
                'description',
                'duration',
                'location',
                'invited',
              ]
            : [
                'date',
                'time',
                'title',
                'description',
                'duration',
                'location',
                'advisee',
                'adviser',
              ],
      },
      success() {
        busy.value = false;
        Notify.create({
          message: 'Booking updated',
        });
        $router.push({
          name: 'calendar',
        });
      },
      error(err) {
        Notify.create({
          message: String(err),
          color: 'negative',
          icon: 'error',
        });
      },
    },
  });
}


function cancelBooking() {
  TheWorkflows.emit({
    type: 'cancelBooking',
    arg: {
      payload: {
        booking: booking.value,
      },
      success() {
        busy.value = false;
        Notify.create({
          message: 'Booking canceled',
          color: 'positive',
          icon: 'check',
        });
        $router.push({
          name: 'calendar',
        });
      },
      error(err) {
        Notify.create({
          message: String(err),
          color: 'negative',
          icon: 'error',
        });
      },
    },
  });
}

function setDuration() {
  if (booking.value) {
    const [hrStr, minStr] = (booking.value.duration || '1:00').split(':');
    const hr = Number(hrStr);
    const min = Number(minStr);
    booking.value.duration = `${hr}h` + (min ? ` ${min}m` : '');
  }
}
</script>
