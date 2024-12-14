<template>
  <q-page class="column justify-center items-center q-page q-gutter-md">
    <!-- Rectangle div -->
    <div class="booking-page-container full-width q-px-lg q-py-md">
      <!-- Search Section -->
      <div class="booking-search-cont column full-width">
        <q-btn
          v-if="!isSearchExpanded"
          class="bg-primary search-btn q-mb-md"
          @blur="expandSearch"
        >
          <q-icon name="search" color="white" />
        </q-btn>
        <div v-else class="search-input-wrapper bg-primary">
          <q-input
            v-model="searchQuery"
            placeholder="Search Adviser"
            filled
            class="expanded-search-input"
            @blur="collapseSearch"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="white" />
            </template>
            <template v-slot:append>
              <q-icon
                name="close"
                class="cursor-pointer"
                color="white"
                @click="collapseSearch"
              />
            </template>
          </q-input>
        </div>
      </div>

      <!-- Adviser List -->
      <div
        class="adviser-lists-container bg-secondary column q-pa-md q-gutter-sm"
      >
        <div class="adviser-list-text text-h3 text-bold text-primary q-mb-md">
          Adviser
        </div>
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
        <div class="adviser-lists row wrap q-gutter-md q-col-gutter-md">
          <q-btn
            v-for="(adviser, index) in 5"
            :key="index"
            @click="appearBookingDialog"
            class="bg-primary q-pa-md"
            :class="['q-md:w-18', 'q-sm:w-45', 'q-xs:w-100']"
          >
            <q-icon name="person" color="white" />
            <span class="text-bold text-white">Adviser {{ index + 1 }}</span>
          </q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { QTableColumn } from 'quasar';
import { TheDialogs } from 'src/dialogs/the-dialogs';
import { IBooking } from 'src/entities';
import { useBookingStore } from 'src/stores/booking.store';
import { computed, onMounted, ref } from 'vue';
const bookingStore = useBookingStore();
// Define reactive variables
const isSearchExpanded = ref(false); // Tracks if the search button is expanded
const isBookingAppear = ref(false); // Tracks if the user is booking an appointment
const searchQuery = ref<string>(''); // Stores the input value
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

// Methods
const expandSearch = () => {
  isSearchExpanded.value = true;
};

const collapseSearch = () => {
  isSearchExpanded.value = false;
};

const appearBookingDialog = () => {
  isBookingAppear.value = true;
};

const disappearBookingDialog = () => {
  isBookingAppear.value = false;
};
</script>

<style>
.booking-page-container {
  max-width: 1400px;
  align-items: flex-start;
  justify-content: center;
  display: inline-block;
  margin: 0 auto;
}

.search-btn {
  position: absolute;
  right: 0px;
  bottom: 0px;
  width: 55px;
  height: 55px;
  border-radius: 8px;
  z-index: 10px;
}

.search-input-wrapper {
  position: absolute;
  right: 0px;
  bottom: 0px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.expanded-search-input .q-field__native {
  color: white;
}

.expanded-search-input ::placeholder {
  color: white;
}

.booking-search-cont {
  position: relative;
  height: 100px;
}

.adviser-lists-container {
  position: relative;
  width: 100%;
  max-width: 1400px;
  height: 700px;
  border: 1px solid var(--q-color-primary);
  border-radius: 8px;
  display: flex;
  flex-direction: column; /* Ensure column format */
  align-items: center;
  justify-content: flex-start; /* Adjust as needed */
  margin: 20px auto;
  padding: 20px; /* Optional: Space within container */
}

.adviser-list-text {
  align-self: flex-start; /* Ensure proper alignment */
  margin-bottom: 20px; /* Space between title and list */
}

.adviser-lists {
  display: flex;
  flex-direction: row; /* Horizontal alignment */
  align-items: center; /* Center align buttons vertically */
  justify-content: flex-start; /* Align buttons to the left */
  gap: 10px; /* Add space between buttons */
  width: 100%;
}

/* Media Queries for Small Devices */
@media (max-width: 768px) {
  .booking-search-cont {
    height: auto;
    padding: 10px;
  }

  .search-btn {
    width: 55px;
    height: 55px;
    bottom: 0px;
    right: 0px;
  }

  .adviser-lists-container {
    height: 500px;
  }
}

@media (max-width: 480px) {
  .search-input-wrapper {
    width: 70%;
    right: 0px;
    bottom: 0px;
  }
}
</style>
