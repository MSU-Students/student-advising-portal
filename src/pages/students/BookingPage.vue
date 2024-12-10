<template>
  <q-page class="column justify-center items-center q-page" style="gap: 5px">
    <!-- Rectangle div -->
    <div class="booking-page-container col-lg">
      <div class="booking-search-cont bg-secondar column">
        <q-btn
          v-if="!isSearchExpanded"
          class="bg-primary search-btn"
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
      <div class="adviser-lists-container bg-secondary col-lg">
        <div class="adviser-list-text text-h3 text-bold text-primary">
          Adviser
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Define reactive variables
const isSearchExpanded = ref(false); // Tracks if the search button is expanded
const searchQuery = ref<string>(''); // Stores the input value

// Methods
const expandSearch = () => {
  isSearchExpanded.value = true;
};

const collapseSearch = () => {
  isSearchExpanded.value = false;
};
</script>

<style>
.booking-page-container {
  width: 100%;
  max-width: 1400px;
  align-items: flex-start;
  justify-content: center;
  display: inline-block;
  margin: 0 auto;
}

.search-btn {
  position: absolute;
  right: 0px;
  bottom: 5px;
  width: 55px;
  height: 55px;
  border-radius: 8px;
  z-index: 10px;
}

.search-input-wrapper {
  position: absolute;
  right: 0px;
  bottom: 5px;
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

.adviser-list-text {
  position: absolute;
  top: 20px;
  left: 20px;
}

.adviser-lists-container {
  position: relative;
  width: 100%;
  max-width: 1400px;
  height: 700px;
  border: 1px solid var(--q-color-primary);
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin: 20px auto;
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
    right: 10px;
  }

  .adviser-lists-container {
    height: 500px;
  }
}

@media (max-width: 480px) {
  .search-input-wrapper {
    width: 70%;
    right: 0;
    bottom: 0px;
    right: 10px;
  }
}
</style>
