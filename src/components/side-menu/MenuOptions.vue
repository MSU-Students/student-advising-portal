<template>
  <q-list>
    <q-item
      v-for="option in menuOptions"
      :key="option.name"
      clickable
      v-ripple="activeOption === option.name"
      :to="option.name"
      v-on:click="setActiveOption(option.name)"
      :active="activeOption === option.name"
      active-class="rounded-borders bg-white"
      class="q-mb-md"
    >
      <q-item-section avatar>
        <q-icon
          :name="option.icon"
          :color="activeOption === option.name ? 'primary' : 'white'"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label
          :class="activeOption === option.name ? 'text-primary' : 'text-white'"
        >
          {{ option.label }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue';
import { useRoute } from 'vue-router';
import { MenuOptionItem } from './types';

const route = useRoute();
const activeOption = ref('');

defineProps<{ menuOptions: MenuOptionItem[] }>();

const setActiveOption = (optionName: string) => {
  activeOption.value = optionName;
};

onMounted(() => {
  const currentPath = route.path;

  if (currentPath.includes('notification')) {
    activeOption.value = 'notification';
  } else if (currentPath.includes('history')) {
    activeOption.value = 'history';
  } else if (currentPath.includes('profile')) {
    activeOption.value = 'profile';
  } else {
    activeOption.value = 'appointment'; // Default to appointment
  }
});
</script>
