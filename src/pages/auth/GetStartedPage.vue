<template>
  <q-page class="column justify-center items-center q-page">
    <div
      class="absolute-top-left q-ma-lg flex items-center cursor-pointer"
      v-ripple
      @click="logout"
    >
      <q-btn round color="secondary" size="sm" icon="logout" class="q-mr-sm" />
      <span class="text-primary text-h6 text-bold text-center">LOGOUT</span>
    </div>

    <span
      class="text-center text-weight-bolder text-primary q-mb-xl"
      :class="{
        'text-h3': $q.screen.gt.sm,
        'text-h4': $q.screen.sm,
        'text-h5': $q.screen.xs,
      }"
      >SELECT USER TYPE</span
    >

    <div
      class="row justify-center items-center q-cards"
      :class="$q.screen.gt.xs ? 'q-gutter-xl' : 'q-gutter-md'"
    >
      <q-card
        v-for="role in role_options"
        :key="role.name"
        @click="selectRole(role.name)"
        class="column items-center justify-center my-q-card cursor-pointer"
        :class="{ 'bg-primary': selectedRole === role.name }"
        v-ripple
      >
        <q-card-section class="q-pb-none">
          <q-icon
            :name="role.icon"
            :color="selectedRole !== role.name ? 'primary' : 'white'"
            :size="$q.screen.gt.sm ? '80px' : $q.screen.sm ? '60px' : '40px'"
          />
        </q-card-section>

        <q-card-section
          class="text-weight-bolder text-center q-pt-sm"
          :class="[
            selectedRole === role.name ? 'text-white' : 'text-primary',
            $q.screen.gt.sm ? 'text-h4' : $q.screen.sm ? 'text-h5' : 'text-h6',
          ]"
        >
          {{ role.label }}
        </q-card-section>
      </q-card>
    </div>

    <q-btn
      unelevated
      rounded
      color="primary"
      :label="buttonLabel"
      :disable="!selectedRole"
      class="q-mt-xl"
      :class="$q.screen.gt.xs ? 'q-py-md q-px-xl' : 'q-py-sm q-px-lg'"
      @click="continueAs"
    />
  </q-page>
</template>

<script setup lang="ts">
import { TheDialogs } from 'src/dialogs/the-dialogs';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

interface Role {
  name: string;
  label: string;
  icon: string;
}
const $router = useRouter();
const role_options: Role[] = [
  { name: 'student', label: 'STUDENT', icon: 'school' },
  { name: 'adviser', label: 'FACULTY', icon: 'menu_book' },
  { name: 'admin', label: 'ADMIN', icon: 'construction' },
];

const selectedRole = ref<string | null>(null);

const buttonLabel = computed(() =>
  selectedRole.value ? `CONTINUE AS ${selectedRole.value}` : 'CONTINUE AS...'
);

const selectRole = (roleName?: string) => {
  if (!roleName) return;
  selectedRole.value = roleName || null;
  console.log(selectedRole.value);
};

const continueAs = () => {
  if (selectedRole.value === 'admin') {
    TheDialogs.emit({ type: 'adminDialog', arg: {} });
  } else if (selectedRole.value === 'student') {
    TheDialogs.emit({ type: 'studentDialog', arg: {} });
  } else if (selectedRole.value === 'adviser') {
    TheDialogs.emit({ type: 'adviserDialog', arg: {} });
  }
};

function logout() {
  TheDialogs.emit({
    type: 'logoutDialog',
    arg: {
      success() {
        $router.replace({
          name: 'login',
        });
      },
    },
  });
}
</script>

<style lang="sass">
.q-cards
  width: 100%
  max-width: 1200px
  padding: 0 16px

.q-page
  min-height: 100vh
  height: auto

.my-q-card
  // Desktop size
  width: 240px
  aspect-ratio: 1
  border-radius: 24px

  // Large mobile
  @media (max-width: 599px)
    width: 160px
    border-radius: 16px

  &:hover
    transform: translateY(-4px)
    transition: transform 0.3s ease
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)
</style>
