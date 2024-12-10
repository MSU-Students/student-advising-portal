<template>
  <q-page class="forgot-password-container">
    <q-card
      class="q-pa-lg shadow-4"
      style="max-width: 400px; margin: auto; border-radius: 15px"
    >
      <q-card-section class="text-center">
        <h2 id="forgot-password-title" class="q-mb-md">Forgot Password</h2>
        <p class="text-body q-mb-lg">
          Enter your email address to receive a password reset link.
        </p>
      </q-card-section>

      <q-form @submit.prevent="handlePasswordReset">
        <q-input
          v-model="email"
          placeholder="Email Address"
          type="email"
          filled
          clearable
          dense
          :rules="['email']"
          required
          aria-labelledby="forgot-password-title"
          aria-live="polite"
        />
        <q-btn
          label="Reset Password"
          color="primary"
          type="submit"
          unelevated
          class="reset-btn q-mt-md"
        />
      </q-form>

      <div class="forgot-password-footer">
        Already have an account?
        <q-btn dense flat :to="{ name: 'login' }">Sign In</q-btn>
      </div>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { TheWorkflows } from 'src/workflows/the-workflows';

// Reactive variables
const email = ref('');

// Router instance
const router = useRouter();

const handlePasswordReset = () => {
  TheWorkflows.emit({
    type: 'resetPassword',
    arg: {
      payload: email.value,
      success: () => {
        Notify.create({
          type: 'positive',
          message: 'Password reset link has been sent. Redirecting...',
        });

        router.push({
          name: 'login',
        });
      },
      error: (err) => {
        Notify.create({
          type: 'negative',
          message: String(err),
        });
      },
    },
  });
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

* {
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

/* Container */
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #eeeeee;
  padding: 20px;
  color: #fff;
  margin: auto; /* Centers the container horizontally */
  height: auto; /* Adjusted to fit content */
}

.q-pa-lg {
  background: #fff;
  animation: fadeIn 0.5s ease-in-out; /* Add fade-in effect */
}
.q-pa-lg:hover {
  background-color: #f9f9f9; /* Light background color change on hover */
}

.text-center h2 {
  margin-bottom: 5px;
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
.reset-btn:focus {
  outline: 2px solid #4a78ff;
  outline-offset: 2px;
}

/* Footer */
.forgot-password-footer {
  font-size: 14px;
  color: #777;
  margin-top: 20px;
  text-align: center; /* Center the footer text */
}

.forgot-password-footer a {
  color: #4a78ff;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
  cursor: pointer;
}

.forgot-password-footer a:hover {
  text-decoration: underline;
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
/* Responsive Styles */
@media (max-width: 768px) {
  .q-card {
    max-width: 350px; /* Slightly smaller card for tablets */
  }

  .reset-btn {
    font-size: 15px;
    padding: 10px;
  }

  .forgot-password-footer {
    font-size: 13px; /* Adjust font size for better readability */
  }
}

@media (max-width: 480px) {
  .q-card {
    max-width: 300px; /* Smaller card for mobile screens */
    padding: 10px;
  }

  .reset-btn {
    font-size: 14px;
    padding: 8px;
  }

  .forgot-password-footer {
    font-size: 12px;
  }

  .forgot-password-container {
    padding: 15px; /* Extra padding for very small screens */
  }
}
</style>
