<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page
        class="flex column q-pa-lg justify-center items-center"
        style="height: 100vh"
      >
        <span class="text-h3 text-weight-bolder text-primary q-mb-xl"
          >SELECT USER TYPE</span
        >

        <div class="flex row q-gutter-xl">
          <q-card
            class="flex column items-center justify-center my-q-card cursor-pointer"
            v-for="role in role_options"
            :key="role.name"
            @click="selectRole(role.name)"
            v-ripple
          >
            <q-card-selection>
              <q-icon :name="role.icon" color="primary" size="80px" />
            </q-card-selection>
            <q-card-section
              class="text-h4 text-weight-bolder text-primary q-pt-md"
            >
              {{ role.label }}
            </q-card-section>
          </q-card>
        </div>

        <q-btn
          unelevated
          rounded
          color="primary"
          label="CONTINUE AS..."
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
  { name: 'admin', label: 'ADMIN', icon: 'build' },
];

const selectedRole = ref<string | null>(null);

const selectRole = (roleName: string | undefined) => {
  selectedRole.value = roleName || null;
};
</script>

<style lang="sass">
.my-q-card
  width: 240px
  height: 240px
  border-radius: 32px
</style>
