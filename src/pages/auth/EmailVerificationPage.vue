<template>
  <q-page class="email-verification-page">
    <div class="verification-container">
      <q-card class="verification-card">
        <q-card-section class="text-center">
          <q-icon name="check_circle" size="64px" color="green" />
          <h1 class="title">Email Verification</h1>
          <p class="description">
            Please check your email to verify your account. If you don’t see the
            email, check your spam folder.
          </p>
        </q-card-section>
        <q-card-actions class="action-buttons">
          <q-btn
            @click="resendVerificationEmail"
            label="Resend Verification Email"
            color="primary"
          />
          <q-btn
            @click="goToLogin"
            label="Go to Login"
            color="secondary"
            flat
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { useAuthStore } from 'src/stores/auth.store';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';

const authStore = useAuthStore();
const $router = useRouter();
onMounted(async () => {
  const user = await authStore.getUser();
  if (user?.emailVerified) {
    $router.replace({
      name: 'home',
    });
  }
});

const resendVerificationEmail = async () => {
  try {
    await authStore.resendEmailVerification();
    Notify.create({
      type: 'positive',
      message: 'Verification email has been resent. Please check your inbox.',
    });
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Failed to resend verification email. Please try again later.',
    });
  }
};

const goToLogin = () => {
  $router.push({ name: 'login' });
};
</script>

<style lang="scss" scoped>
.email-verification-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;

  .verification-container {
    width: 100%;
    max-width: 400px;
    margin: 20px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    background-color: white;

    .verification-card {
      text-align: center;

      .title {
        margin-top: 15px;
        font-size: 24px;
        font-weight: bold;
        color: #333;
      }

      .description {
        margin: 10px 0;
        font-size: 16px;
        color: #666;
      }

      .action-buttons {
        display: flex;
        justify-content: space-around;
        margin-top: 20px;
      }
    }
  }
}
</style>
