<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
    <LogOutDialog />
  </q-layout>
</template>

<script setup lang="ts">
import LogOutDialog from 'src/dialogs/auth/LogOutDialog.vue';
</script>
