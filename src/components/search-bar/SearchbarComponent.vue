<template>
  <div class="q-mr-md search-container">
    <q-input 
      rounded 
      dense 
      outlined 
      v-model="searchText" 
      placeholder="Search"
      bg-color="grey-2"
      clearable
      @update:model-value="search"
      >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <q-list 
      v-if="showSuggestions && searchText"  
      class="suggestions-list"
    >
      <q-item 
        v-for="profile in filteredProfiles" 
        :key="profile.key" 
        clickable 
        @click="selectProfile(profile)"
        rounded
      >
        <q-item-section avatar>
          <q-avatar class="avatar">
            <img :src="`${profile.avatar}`">
          </q-avatar>
        </q-item-section>
        
        <q-item-section>
          <q-item-label class="name-label">
            <span v-html="highlightMatch(profile.fullName)"></span>
          </q-item-label>
          <q-item-label class="email-label" caption lines="1">
            <span v-html="highlightMatch(profile.email!)"></span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <div v-if="!showSuggestions && !isContactSelected && searchText" class="no-results">
      No results found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { IProfile } from 'src/entities';
import { useProfileStore } from 'src/stores/profile.store';
import { ref, computed } from 'vue';

const searchText = ref('');
const profileStore = useProfileStore();
const profiles = ref<IProfile[]>([]);
const isContactSelected = ref(false);

const showSuggestions = computed(() => {
  return profiles.value.length > 0;
});

const selectProfile = (profile: IProfile) => {
  searchText.value = profile.fullName;
  profiles.value = [];
  isContactSelected.value = true; 
};

const highlightMatch = (text: string) => {
  const query = searchText.value;
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<strong>$1</strong>');
};

// Prevents flickering of the suggestion list by filtering profiles as you type.
const filteredProfiles = computed(() =>
  profiles.value.filter(profile =>
    profile.fullName.toLowerCase().includes(searchText.value.toLowerCase())
  )
);

const search = async () => {
  isContactSelected.value = false;
  profiles.value = await profileStore.findProfiles(searchText.value);
}
</script>

<style lang="sass">
.search-container 
  position: relative
  flex: 1
  min-width: 150px

.suggestions-list 
  position: absolute
  top: 100%
  left: 0
  width: 100% 
  border: 1px solid #ccc
  background: #fff
  z-index: 10 
  max-height: 270px 
  overflow-y: auto

.no-results 
  position: absolute
  top: 100% 
  left: 0
  width: 100%
  padding: 10px
  color: grey
  text-align: center
  background: #fff
  border: 1px solid #ccc
  z-index: 10

.avatar
  width: 2.875rem
  height: 2.875rem

.name-label
  font-size: 1rem

.email-label
  font-size: 0.675rem

@media (max-width: 600px)
  .avatar
    width: 2rem
    height: 2rem

  .name-label
    font-size: 0.775rem

  .email-label  
    font-size: 0.65rem
</style>
