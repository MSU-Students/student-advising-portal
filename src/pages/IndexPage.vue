<template>
  <q-page class="flex flex-center">
    <div class="container">
      <div class="welcome-message">
        <h2>Welcome to Your Dashboard!</h2>
      </div>
      <div class="data-analytics">
        <h2>Data Analytics</h2>
        <p>This section will show data analysis and charts.</p>
      </div>
      <div class="activity-log">
        <h2>Activity Log</h2>
        <ul>
          <li v-for="(activity, index) in activities" :key="index">
            {{ activity.type }} {{ activity.date }}
          </li>
        </ul>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { date } from 'quasar';
import { ILoggable } from 'src/entities';
import { useAuthStore } from 'src/stores/auth.store';
import { useTransactionLogsStore } from 'src/stores/transaction-log-store';
import { onMounted, ref } from 'vue';
const logStore = useTransactionLogsStore();
const authStore = useAuthStore();
const activities = ref<ILoggable[]>([]);
onMounted(async () => {
  const logs = await logStore.findTransactions({
    operator: authStore.currentUser?.key || '',
  });
  activities.value = logs.sort((a, b) =>
    date.getDateDiff(b.date, a.date, 'seconds')
  );
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.welcome-message {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 100%;
  max-width: 800px;
  text-align: center;
}

.data-analytics {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 100%;
  max-width: 800px;
}

.activity-log {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 100%;
  max-width: 800px;
}

.activity-log ul {
  list-style: none;
  padding: 0;
}

.activity-log li {
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
}

.activity-log li:last-child {
  border-bottom: none;
}
</style>
