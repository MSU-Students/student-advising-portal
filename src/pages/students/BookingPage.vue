<template>
  <q-page class="column justify-center items-center q-page" style="gap: 20px">
    <!-- Rectangle div -->
    <div class="rectangle-wrapper">
      <div>
        <q-btn
          v-if="!isSearchExpanded"
          class="bg-primary search-btn"
          @click="expandSearch"
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
      <div class="rectangle bg-secondary">
        <div class="adviser-list-container">
          <h1 class="adviser-list text-primary">List of Adviser</h1>
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
.rectangle-wrapper {
  position: relative;
  display: inline-block;
}

.search-btn {
  position: absolute;
  top: -70px;
  right: 0px;
  width: 55px;
  height: 55px;
  border-radius: 8px;
  z-index: 10px;
}

.search-input-wrapper {
  position: absolute;
  top: -70px;
  right: 0px;
  z-index: 10;
  border-radius: 8px;
  width: 500px; /* Adjust width as needed */
  transition: ease-in;
}

.expanded-search-input .q-field__native {
  color: white; /* Makes the input text white */
}

.expanded-search-input ::placeholder {
  color: white;
}

.rectangle {
  width: 1400px; /* Define the width of the rectangle */
  height: 700px; /* Define the height of the rectangle */
  padding-top: 5%;
  border-radius: 8px; /* Optional: Rounded corners */
  display: flex; /* Optional: Control content inside the rectangle */
  align-items: center; /* Optional: Center content vertically */
  justify-content: center; /* Optional: Center content horizontally */
}

.adviser-list-container {
  top: 10px; /* Adjust as necessary for spacing */
  left: 10px; /* Adjust as necessary for spacing */
  z-index: 20; /* Make sure the title stays on top */
}

.adviser-list {
  font-size: 2rem; /* Adjust the font size as needed */
  font-weight: bold; /* Makes the text bold */
}
</style>
