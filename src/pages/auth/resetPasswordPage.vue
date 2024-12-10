<template>
  <q-page class="reset-password-container">
    <q-card
      class="q-pa-lg shadow-4"
      style="max-width: 400px; margin: auto; border-radius: 15px"
    >
      <q-card-section class="text-center">
        <h2 id="reset-password-title" class="q-mb-md">Reset Password</h2>
        <p class="text-body q-mb-lg">
          Enter your new password below to reset it.
        </p>
      </q-card-section>

      <q-form @submit.prevent="handleResetPassword">
        <q-input
          v-model="password"
          placeholder="New Password"
          type="password"
          filled
          dense
          required
          class="q-mb-md"
        />
        <q-input
          v-model="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          filled
          dense
          required
        />
        <q-btn
          label="Reset Password"
          color="primary"
          type="submit"
          unelevated
          class="reset-btn q-mt-md"
        />
      </q-form>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';

// Reactive variables
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');

// Router instance
const router = useRouter();

const handleResetPassword = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!password.value || !confirmPassword.value) {
    errorMessage.value = 'Please fill in all fields.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }

  try {
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Replace with your API call logic to reset the password
    console.log('Password reset successful:', password.value);

    // Success notification
    Notify.create({
      type: 'positive',
      message: 'Your password has been successfully reset.',
    });

    // Redirect to login page
    successMessage.value = 'Password reset successful. Redirecting to login...';
    setTimeout(() => {
      router.push('/auth/login');
    }, 2000);
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Failed to reset password. Please try again.';
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

/* Common Styles */
* {
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

/* Container */
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #eeeeee;
  padding: 20px;
  color: #fff;
}

/* Card */
.q-pa-lg {
  background: #fff;
  animation: fadeIn 0.5s ease-in-out;
}

.text-center h2 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.text-body {
  font-size: 14px;
  color: #777;
  margin-bottom: 20px;
}

/* Button */
.reset-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(40deg, #4a78ff, #2a4fb7);
  border: none;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: background 0.3s ease;
}
.reset-btn:hover {
  background: linear-gradient(40deg, #2a4fb7, #1a237e);
}

/* Messages */
.error-message {
  color: #dc3545;
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
}
.success-message {
  color: #28a745;
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
}

/* Fade-in animation */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
