<template>
  <q-page>
    <div class="subcontent q-mx-md">
      <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />
      <q-toolbar>
        <q-space />
        <q-btn v-if="!dayView" rounded icon="add" @click="bookAppointment"
          >Book</q-btn
        >
      </q-toolbar>
      <div class="row justify-center">
        <div class="" style="display: flex; width: 100%">
          <q-calendar-day
            ref="calendar"
            v-model="selectedDate"
            :now="nowDate"
            bordered
            :view="dayView ? 'day' : 'week'"
            :interval-start="6"
            :interval-count="16"
            :internal-height="200"
            :weekdays="[1, 2, 3, 4, 5, 6, 0]"
            animated
            transition-next="slide-left"
            transition-prev="slide-right"
          >
            <template #day-interval="{ scope }">
              <div
                class="q-mx-xs row"
                v-if="hasEvents(scope.timestamp)"
                style="
                  display: flex;
                  justify-content: space-evenly;
                  align-items: center;
                  font-size: 12px;
                "
              >
                <template
                  v-for="event in getEvents(scope.timestamp)"
                  :key="event.time"
                >
                  <q-card
                    class="col text-white cursor-pointer ellipsis"
                    :class="
                      'booking-' + event.status + ' booking-' + event.type
                    "
                    @click="clickBooking(event)"
                  >
                    <q-list>
                      <q-item>
                        <q-item-section>
                          <q-item-label
                            overline
                            class="text-grey text-uppercase"
                            >{{ event.type }}</q-item-label
                          >
                          <q-item-label>{{ event.description }}</q-item-label>
                          <q-item-label caption class="text-grey">{{
                            event.location
                          }}</q-item-label>
                        </q-item-section>
                        <q-item-section side class="text-white">
                          {{ event.duration }}
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                </template>
              </div>
            </template>
          </q-calendar-day>
          <q-fab
            v-if="dayView"
            color="purple"
            class="fixed-bottom-right q-mr-md q-mb-lg"
            icon="keyboard_arrow_up"
            direction="up"
          >
            <q-fab-action
              color="primary"
              icon="add"
              label="Book"
              @click="bookAppointment"
            />
          </q-fab>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import NavigationBar from './NavigationBar.vue';
import {
  QCalendarDay,
  addToDate,
  parseTimestamp,
  today,
} from '@quasar/quasar-ui-qcalendar/src/index.js';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass';
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { useBookingStore } from 'src/stores/booking.store';
import { date, useQuasar } from 'quasar';
import { TheDialogs } from 'src/dialogs/the-dialogs';
import { useRouter } from 'vue-router';

const selectedDate = ref(today());
const calendar = ref();
const nowDate = ref(addToDate(parseTimestamp(today()), { day: 1 }).date);
const bookingStore = useBookingStore();
const $router = useRouter();
const $q = useQuasar();
const bookings = ref([]);
function onToday() {
  calendar.value.moveToToday();
}
const dayView = computed(() => {
  return $q.screen.lt.md;
});
onMounted(() => {
  loadBookings();
});
onUnmounted(() => {
  if (subscription) {
    subscription.unsubscribe();
  }
});
let subscription;

function loadBookings() {
  const refDate = new Date(selectedDate.value);
  const startDate = new Date(refDate);
  const endDate = new Date(refDate);
  if (dayView.value) {
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
    endDate.setDate(endDate.getDate() + (7 - endDate.getDay()) + 1);
  }
  if (subscription) {
    subscription.unsubscribe();
  }
  const sub = bookingStore
    .streamWith({
      'date >=': date.formatDate(startDate, 'YYYY-MM-DD'),
      'date <=': date.formatDate(endDate, 'YYYY-MM-DD'),
    })
    .subscribe({
      next: (value) => {
        bookings.value = value || [];
      },
    });
  subscription = sub;
}
function onPrev() {
  calendar.value.prev();
  loadBookings();
}
function onNext() {
  calendar.value.next();
  loadBookings();
}
function clickBooking(booking) {
  $router.push({
    name: 'edit-booking',
    params: {
      key: booking.key,
    },
  });
}
function bookAppointment() {
  TheDialogs.emit({
    type: 'bookAppointmentDialog',
    arg: {
      success: (book) => {
        if (!book) {
          console.error('Failed to book');
        }
      },
    },
  });
}
function getEvents(timestamp) {
  return bookings.value.filter(
    (b) => b.time == timestamp.time && b.date == timestamp.date
  );
}

function hasEvents(timestamp) {
  return bookings.value.find(
    (b) => b.time == timestamp.time && b.date == timestamp.date
  );
}
</script>
<style scoped>
.booking-appointment {
  background: radial-gradient(circle, #35a2ff 0%, #014a88 100%);
}

.booking-consultation {
  background: radial-gradient(circle, #36b86e 0%, #014a88 100%);
}
.booking-pending {
  border: 3px solid black;
}
.booking-cancelled,
.booking-rejected {
  border: 3px solid red;
}
</style>
