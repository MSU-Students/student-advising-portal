<template>
  <q-page class="column justify-center items-center q-page">
    <LogoutButton class="absolute-top-left q-ma-lg" />

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
        :class="{
          'bg-primary': shouldHighlight(role),
        }"
        v-ripple
      >
        <q-card-section class="q-pb-none">
          <q-icon
            :name="role.icon"
            :color="!shouldHighlight(role) ? 'primary' : 'white'"
            :size="$q.screen.gt.sm ? '80px' : $q.screen.sm ? '60px' : '40px'"
          />
        </q-card-section>

        <q-card-section
          class="text-weight-bolder text-center q-pt-sm"
          :class="[
            shouldHighlight(role) ? 'text-white' : 'text-primary',
            $q.screen.gt.sm ? 'text-h4' : $q.screen.sm ? 'text-h5' : 'text-h6',
          ]"
        >
          {{ role.label }}
          <q-badge
            v-if="pendingRequest(role.name)"
            class="text-uppercase"
            floating
            color="positive"
            >{{ pendingRequest(role.name)?.status }}</q-badge
          >
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
import { Notify } from 'quasar';
import { TheDialogs } from 'src/dialogs/the-dialogs';
import { IProfile } from 'src/entities';
import { useAuthStore } from 'src/stores/auth.store';
import { useRequestStore } from 'src/stores/request.store';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

// COMPONENTS
import LogoutButton from 'src/components/LogoutButton.vue';

interface Role {
  name: IProfile['type'];
  label: string;
  icon: string;
}
const $router = useRouter();
const role_options: Role[] = [
  { name: 'student', label: 'STUDENT', icon: 'school' },
  { name: 'adviser', label: 'FACULTY', icon: 'menu_book' },
  { name: 'admin', label: 'ADMIN', icon: 'construction' },
];

const selectedRole = ref<IProfile['type'] | null>(null);

const buttonLabel = computed(() =>
  selectedRole.value ? `CONTINUE AS ${selectedRole.value}` : 'CONTINUE AS...'
);
const requestStore = useRequestStore();
const authStore = useAuthStore();

onMounted(async () => {
  const user = authStore.currentUser;
  if (user?.type && user.type != 'anonymous') {
    $router.replace({ name: 'home' });
  }
  if (user?.key) {
    requestStore.streamRequests({
      'data.key': user.key,
    });
  }
});

function pendingRequest(role: IProfile['type']) {
  return requestStore.requests.find((r) => r.data.type == role);
}
function shouldHighlight(role: Role) {
  return (
    role.name == selectedRole.value ||
    typeof pendingRequest(role.name) != 'undefined'
  );
}
const selectRole = (roleName?: IProfile['type']) => {
  if (!roleName) return;
  if (requestStore.requests.length && !pendingRequest(roleName)) {
    Notify.create({
      message: 'You already have existing application request',
      caption: 'Only one application is allowed at time',
      icon: 'error',
      color: 'negative',
    });
    return;
  }
  selectedRole.value = roleName || null;
};

const continueAs = async () => {
  if (selectedRole.value) {
    const pending = pendingRequest(selectedRole.value);
    if (pending?.status == 'approved') {
      await authStore.getUser();
      Notify.create({
        message: 'Your request has been approved',
        caption: 'reloading your profile',
        timeout: 3000,
        icon: 'warning',
        color: 'warning',
      });
      $router.replace({ name: 'home' });
      return;
    } else if (pending?.status == 'pending') {
      Notify.create({
        message: 'Your request is pending still',
        icon: 'warning',
        color: 'warning',
      });
      return;
    } else if (pending?.status == 'rejected') {
      Notify.create({
        message: 'Your request has been rejected',
        caption: pending.remarks,
        icon: 'warning',
        color: 'warning',
      });
      return;
    }
  }
  if (selectedRole.value === 'admin') {
    TheDialogs.emit({
      type: 'adminApplicationDialog',
      arg: {
        success() {
          selectedRole.value = null;
        },
      },
    });
  } else if (selectedRole.value === 'student') {
    TheDialogs.emit({
      type: 'studentApplicationDialog',
      arg: {
        success() {
          selectedRole.value = null;
        },
      },
    });
  } else if (selectedRole.value === 'adviser') {
    TheDialogs.emit({
      type: 'adviserApplicationDialog',
      arg: {
        success() {
          selectedRole.value = null;
        },
      },
    });
  }
};
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
