<template>
  <q-btn-dropdown label="Filter" color="primary" class="q-ml-sm">
    <q-list>
      <q-item clickable v-ripple>
        <q-item-section>Approved</q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section>Denied</q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section>Pending</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup></script>
