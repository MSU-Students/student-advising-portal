<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
    <LogOutDialog />
    <AdminRequestDialog />
    <StudentRequestDialog />
    <AdviserRequestDialog />
  </q-layout>
</template>

<script setup lang="ts">
import AdminRequestDialog from 'src/dialogs/account-application/AdminRequestDialog.vue';
import StudentRequestDialog from 'src/dialogs/account-application/StudentRequestDialog.vue';
import AdviserRequestDialog from 'src/dialogs/account-application/AdviserRequestDialog.vue';
import LogOutDialog from 'src/dialogs/auth/LogOutDialog.vue';
</script>
