<template>
  <q-page>
    <q-list>
      <q-item v-for="student in profileStore.profiles" :key="student.fullName">
        {{ student.fullName }}
      </q-item>
    </q-list>
  </q-page>
</template>
<script lang="ts" setup>
import { useProfileStore } from 'src/stores/profile.store';

const profileStore = useProfileStore();
</script>
