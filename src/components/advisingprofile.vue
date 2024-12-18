<template>
  <q-card class="q-pa-md" bordered>
    <div>
      <div class="text-h6 q-mb-sm">Personal Information</div>
      <q-list bordered class="q-my-sm">
        <q-item>
          <q-item-section>
            <div><strong>Full Name:</strong></div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <div><strong>Email:</strong></div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <div><strong>Contact:</strong></div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <div><strong>Address:</strong></div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-separator class="q-my-md" />

    <div>
      <div class="text-h6 q-mb-sm">Academic Information</div>
      <q-list bordered class="q-my-sm">
        <q-item>
          <q-item-section>
            <div><strong>Highest Degree:</strong></div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <div><strong>Specialization:</strong></div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <div><strong>Research Interests:</strong></div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <div><strong>Publications:</strong></div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <div><strong>Teaching Experience:</strong></div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-card>
</template>

<script lang="ts">
export default {
  name: 'AdviserProfile',
};
</script>

<style scoped>
.q-card {
  max-width: 1000px;
  margin: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.text-h6 {
  margin-bottom: 8px;
  font-weight: bold;
}
.q-list {
  margin: 0 auto;
}
</style>
