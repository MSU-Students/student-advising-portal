<template>
  <q-page>
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
      <!-- <q-table flat bordered grid :rows="advisers" :columns="columns" /> -->
      <div class="flex-wrap row items-start q-gutter-md">
        <q-card
          class="adviser-card col-auto"
          v-for="adviser in advisers"
          :key="adviser.key"
        >
          <q-card-section class="text-h6">{{
            adviser.fullName
          }}</q-card-section>
          <q-separator />
          <q-card-section>
            <span v-for="column in columns" :key="column.name">
              {{ column.label }}: {{ adviser[column.name] }} <br
            /></span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              icon="insert_invitation"
              label="SET APPOINTMENT"
              @click="openBookingDialog"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { TheDialogs } from 'src/dialogs/the-dialogs';
import { QTableColumn } from 'quasar';
import { IAdviserProfile, IProfile } from 'src/entities';
import { useProfileStore } from 'src/stores/profile.store';
import { onMounted, onUnmounted, ref } from 'vue';

const isSearchExpanded = ref(false); // Tracks if the search button is expanded
const searchQuery = ref<string>(''); // Stores the input value
const profileStore = useProfileStore();
let sub: ReturnType<typeof profileStore.streamProfiles> | undefined;

const advisers = ref<IProfile[]>();

const columns = [
  // {
  //   name: 'fullName',
  //   label: 'Name',
  //   align: 'left',
  //   field: (row: IAdviserProfile) => row.fullName,
  // },
  {
    name: 'college',
    label: 'College',
    align: 'left',
    field: (row: IAdviserProfile) => row.college,
  },
  {
    name: 'department',
    label: 'Department',
    align: 'left',
    field: (row: IAdviserProfile) => row.department,
  },
  {
    name: 'position',
    label: 'Position',
    align: 'left',
    field: (row: IAdviserProfile) => row.position,
  },
] as QTableColumn[];

onMounted(async () => {
  sub?.unsubscribe();
  advisers.value = await profileStore.findProfiles(
    searchQuery.value,
    'adviser'
  );
});

onUnmounted(() => {
  sub?.unsubscribe();
});

// Methods
const expandSearch = () => {
  isSearchExpanded.value = true;
};

const collapseSearch = () => {
  isSearchExpanded.value = false;
};

const openBookingDialog = () => {
  TheDialogs.emit({
    type: 'studentBookingDialog',
    arg: {
      success() {},
    },
  });
};
</script>

<style>
/* .adviser-card {
  width: 100%;
  max-width: 250px;
} */

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
