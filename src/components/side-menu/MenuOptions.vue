<template>
  <q-list>
    <template v-for="option in menuOptions" :key="option.name">
      <q-item
        v-if="!option.submenu || option.submenu.length == 0"
        clickable
        v-ripple="activeOption === option.name"
        :to="option.link || option.name"
        @click="setActiveOption(option.name)"
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
            :class="
              activeOption === option.name ? 'text-primary' : 'text-white'
            "
          >
            {{ option.label }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-expansion-item
        v-else
        expand-icon-toggle
        expand-icon-class="text-white"
        default-opened
        @click="setActiveOption(option.name)"
        :active="activeOption === option.name"
        active-class="rounded-borders bg-white"
        class="q-mb-md text-white"
        :label="option.label"
        :icon="option.icon"
      >
        <MenuOptions :menu-options="option.submenu" />
      </q-expansion-item>
    </template>
  </q-list>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue';
import { useRoute } from 'vue-router';
import { MenuOptionItem } from './types';

const activeOption = ref('');

defineProps<{ menuOptions: MenuOptionItem[] }>();
defineExpose({
  name: 'MenuOptions',
});
const setActiveOption = (optionName: string) => {
  activeOption.value = optionName;
};

onMounted(() => {
  const route = useRoute();
  activeOption.value = route.name as string;
});
</script>
