<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page
        class="flex column q-pa-lg justify-center items-center"
        style="height: 100vh"
      >
        <span
          class="text-h3 lg:text-h2 text-weight-bolder text-primary q-mb-md lg:q-mb-xl"
          >SELECT USER TYPE</span
        >

        <div
          class="flex flex-wrap justify-center items-center q-gutter-md lg:q-gutter-xl"
          style="width: 100%; max-width: 1200px"
        >
          <q-card
            v-for="role in role_options"
            :key="role.name"
            @click="selectRole(role.name)"
            class="flex column items-center justify-center my-q-card cursor-pointer"
            :class="{ 'bg-primary': selectedRole === role.name }"
            v-ripple
          >
            <q-card-section class="flex items-center justify-center q-pt-md">
              <q-icon
                :name="role.icon"
                :color="selectedRole !== role.name ? 'primary' : 'white'"
                :size="$q.screen.lt.sm ? '60px' : '80px'"
              />
            </q-card-section>
            <q-card-section
              class="text-h4 lg:text-h5 text-weight-bolder q-pt-s text-center"
              :class="
                selectedRole === role.name ? 'text-white' : 'text-primary'
              "
            >
              {{ role.label }}
            </q-card-section>
          </q-card>
        </div>

        <q-btn
          unelevated
          rounded
          color="primary"
          :label="
            selectedRole
              ? `CONTINUE AS ${selectedRole.toUpperCase()}`
              : 'CONTINUE AS...'
          "
          :disable="!selectedRole"
          class="q-mt-xl q-py-sm q-px-xl"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Role {
  name?: string;
  label?: string;
  icon?: string;
}

const role_options: Role[] = [
  { name: 'student', label: 'STUDENT', icon: 'school' },
  { name: 'faculty', label: 'FACULTY', icon: 'menu_book' },
  { name: 'admin', label: 'ADMIN', icon: 'construction' },
];

const selectedRole = ref<string | null>(null);

const selectRole = (roleName: string | undefined) => {
  selectedRole.value = roleName || null;
  console.log(selectedRole.value);
};
</script>

<style lang="sass">
.my-q-card
  width: 100%
  max-width: 240px
  min-width: 150px
  aspect-ratio: 1
  border-radius: 32px
  @media (min-width: 600px)
    border-radius: 32px

  transition: background-color 0.3s ease

  &:hover
    transform: translateY(-4px)
    transition: transform 0.3s ease
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)
</style>
