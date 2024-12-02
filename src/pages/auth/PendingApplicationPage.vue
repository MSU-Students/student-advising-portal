<template>
  <q-page class="column justify-center items-center q-page">
    <LogoutButtonComponent />

    <span
      class="text-primary text-center"
      :class="{
        'text-h6 q-mb-sm': $q.screen.xs,
        'text-h5 q-mb-md': $q.screen.sm,
        'text-h4 q-mb-lg': $q.screen.md,
        'text-h2 q-mb-lg': $q.screen.lg,
      }"
      >YOUR APPLICATION IS BEING PROCESSED...</span
    >

    <q-spinner
      color="primary"
      :size="$q.screen.lt.sm ? '2em' : $q.screen.lt.md ? '3em' : '5em'"
    />
  </q-page>
</template>

<script setup lang="ts">
import LogoutButtonComponent from 'src/components/LogoutButtonComponent.vue';
</script>

<style lang="sass"></style>
