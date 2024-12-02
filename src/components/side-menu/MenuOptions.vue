<template>
  <q-list>
    <q-item
      v-for="option in filteredMenuOptions"
      :key="option.name"
      clickable
      v-ripple="activeOption === option.name"
      :to="option.link || option.name"
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
import { ref, computed, onMounted, defineProps } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from 'src/stores/auth.store';
import { MenuOptionItem } from './types';

const route = useRoute();
const authStore = useAuthStore();
const activeOption = ref('');

const props = defineProps<{ menuOptions: MenuOptionItem[] }>();

const filteredMenuOptions = computed(() => {
  const user = authStore.currentUser;
  const userType = user?.type || 'anonymous';

  return props.menuOptions.filter((option) => {
    const routeMeta = route.matched.find((r) => r.name === option.name)?.meta;
    const requiresLogin = routeMeta?.requiresLogin;

    return Array.isArray(requiresLogin)
      ? requiresLogin.includes(userType)
      : requiresLogin === true;
  });
});

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
