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
            @change="changeView"
            @click-time="clickTime"
            :interval-height="intervalHeight"
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
                    :style="'height:' + getBookingHeight(event) + 'px'"
                  >
                    <q-list>
                      <q-item>
                        <q-item-section>
                          <q-item-label>{{
                            event.title || event.description
                          }}</q-item-label>
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
const intervalHeight = 50;
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
function changeView(dates) {
  loadBookings(dates.start, dates.end);
}
onMounted(() => {
  loadBookings();
});
onUnmounted(() => {
  if (subscription) {
    subscription.unsubscribe();
  }
});
let subscription;
const startDate = ref(new Date(new Date()));
const endDate = ref(new Date(new Date()));
function loadBookings(start, end) {
  if (start && end) {
    if (
      date.getDateDiff(start, startDate.value, 'days') == 0 &&
      date.getDateDiff(end, endDate.value, 'days') == 0
    ) {
      return;
    }
    startDate.value = new Date(start);
    endDate.value = new Date(end);
  }
  if (subscription) {
    subscription.unsubscribe();
  }
  const sub = bookingStore
    .streamWith({
      'date >=': date.formatDate(startDate.value, 'YYYY-MM-DD'),
      'date <=': date.formatDate(endDate.value, 'YYYY-MM-DD'),
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
}
function onNext() {
  calendar.value.next();
}
function getBookingHeight(booking) {
  const duration = booking.duration || '';
  const [hrString] = duration.match(/\d{1,3}\s?h/) || ['0'];
  const [minString] = duration.match(/\d{1,3}\s?m/) || ['0'];
  const hr = Number(hrString.replace(/\s?h/, ''));
  const min = Number(minString.replace(/\s?m/, ''));
  return Math.round((hr + min / 60) * intervalHeight);
}
function clickTime(data) {
  TheDialogs.emit({
    type: 'bookAppointmentDialog',
    arg: {
      payload: {
        date: data.scope.timestamp.date,
        time: data.scope.timestamp.time,
      },
      success: () => {
        loadBookings();
      },
    },
  });
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
  background: radial-gradient(circle, #35a2ff 0%, #15181b 100%);
}

.booking-consultation {
  background: radial-gradient(circle, #36b86e 0%, #737c6f 100%);
}
.booking-pending {
  border: 3px solid black;
}
.booking-cancelled,
.booking-rejected {
  border: 3px solid red;
}
</style>
