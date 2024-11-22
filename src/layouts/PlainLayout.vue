<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
    <LogOutDialog />
    <AdminRequestDialog />
  </q-layout>
</template>

<script setup lang="ts">
import AdminRequestDialog from 'src/dialogs/auth/AdminRequestDialog.vue';
import LogOutDialog from 'src/dialogs/auth/LogOutDialog.vue';
</script>
