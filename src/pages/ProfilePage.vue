<template>
  <q-page>
    <q-card class="q-pa-md q-mx-sm" bordered>
      <div>
        <div class="text-h6 q-mb-sm">Personal Information</div>
        <q-list bordered class="q-my-sm" v-if="profile">
          <q-item>
            <q-item-section v-if="profile.avatar" avatar>
              <q-avatar>
                <q-img :src="profile.avatar"></q-img>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <div><strong>Full Name:</strong></div>
              <q-item-label>{{ profile.fullName }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <div><strong>Email:</strong></div>
              <q-item-label>{{ profile.email }}</q-item-label>
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

      <div v-if="profile?.type == 'adviser'">
        <div class="text-h6 q-mb-sm">Academic Information</div>
        <q-list bordered class="q-my-sm">
          <q-item>
            <q-item-section>
              <div><strong>College:</strong></div>
              <q-item-label>{{ profile.college }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <div><strong>Department:</strong></div>
              <q-item-label>{{ profile.department }}</q-item-label>
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
  </q-page>
</template>

<script lang="ts" setup>
import { IProfile } from 'src/entities';
import { useProfileStore } from 'src/stores/profile.store';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const $route = useRoute();
const profileStore = useProfileStore();
const profile = ref<IProfile>();
onMounted(async () => {
  profile.value = await profileStore.getProfile(String($route.params?.key));
});
</script>

<style scoped></style>
