<template>
  <q-page class="login-container">
    <!-- Header Title -->
    <div class="text-center q-mb-lg">
      <h1 class="site-title">Student Advising Portal</h1>
    </div>

    <!-- Login Card -->
    <q-card bordered flat class="login-card">
      <q-card-section>
        <div class="row q-col-gutter-lg">
          <!-- Left Section: Image & Quote -->
          <div class="col-12 col-md-6 login-image">
            <q-img
              src="/src/assets/SAPlogo.png"
              alt="SAP Logo"
              class="corner-logo"
            />
            <q-img src="/src/assets/CICSlogo.png" alt="CICS Logo" />
            <p class="image-quote">
              “Where questions meet answers—your portal to personalized
              advising.”
            </p>
          </div>

          <!-- Right Section: Login Form -->
          <div class="login-form">
            <h2 class="q-mb-md">Welcome</h2>
            <p class="form-subtitle q-mb-lg">Sign in to continue</p>

            <!-- Login Form -->
            <q-form>
              <div class="input-wrapper">
                <!-- Username Input -->
                <q-input
                  v-model="username"
                  placeholder="Username"
                  filled
                  dense
                  required
                  aria-label="Username"
                />

                <!-- Password Input with Show/Hide Toggle -->
                <q-input
                  v-model="password"
                  placeholder="Password"
                  :type="passwordVisible ? 'text' : 'password'"
                  filled
                  dense
                  required
                  aria-label="Password"
                >
                  <!-- Password Toggle Button -->
                  <template v-slot:append>
                    <q-btn
                      flat
                      :icon="passwordVisible ? 'visibility_off' : 'visibility'"
                      @click="togglePasswordVisibility"
                      class="password-toggle-btn"
                      aria-label="Toggle password visibility"
                      :style="{ visibility: password ? 'visible' : 'hidden' }"
                    />
                  </template>
                </q-input>
              </div>

              <!-- Forgot Password -->
              <div class="forgot-password q-mb-md">
                <router-link to="forgot-password" class="forgot-password-link">
                  Forgot Password?
                </router-link>
              </div>

              <!-- Sign In Button -->
              <q-btn
                type="submit"
                label="Sign In"
                color="primary"
                unelevated
                class="login-btn q-mb-md"
              />
            </q-form>

            <!-- Divider -->
            <div class="divider">
              <span>or</span>
            </div>

            <!-- Google Login -->
            <q-btn flat class="google-login q-my-md" @click="googleLogin">
              <q-img
                src="/src/assets/google_logo_icon.png"
                alt="Google Icon"
                style="width: 24px; height: 24px; margin-right: 8px"
              />
              Sign in with Google
            </q-btn>

            <!-- Sign Up Section -->
            <p class="signup-text q-mt-lg">
              Don’t have an account?
              <router-link to="sign-up" class="signup-link"
                >Sign Up</router-link
              >
            </p>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'; // Import ref from Vue
import { TheWorkflows } from 'src/workflows/the-workflows';
import { useRouter } from 'vue-router';

const $router = useRouter();
const username = ref('');
const password = ref('');
const passwordVisible = ref(false); // State to toggle password visibility

// Function to toggle password visibility
function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value;
}

function googleLogin() {
  TheWorkflows.emit({
    type: 'loginWithGoogle',
    arg: {
      success: async (profile) => {
        if (profile.type == 'anonymous' || !profile.type) {
          await $router.replace({
            name: 'get-started',
          });
        } else {
          await $router.replace({
            name: 'home',
          });
        }
      },
      error: (err) => {
        console.log(err);
      },
    },
  });
}
</script>

<style scoped>
/* Global styles */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

/* Adjusted input wrapper for better spacing */
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px; /* Space between inputs */
  width: 100%; /* Ensures inputs take full width */
}

.input-wrapper q-input {
  font-size: 16px; /* Adjust font size for better readability */
}

/* Container */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #eeeeee;
  padding: 20px;
  color: #fff;
}

/* Header styles */
.site-title {
  font-size: 2rem;
  font-weight: 1000;
  letter-spacing: 0.5px;
  line-height: 2.5;
  text-transform: uppercase;
  text-align: center;
  background: linear-gradient(80deg, #4a78ff, #2a4fb7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #000; /* Fallback for non-supporting browsers */
}

/* Login card */
.login-card {
  display: flex;
  flex-direction: row;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  max-width: 900px;
  width: 100%;
  animation: fadeIn 0.5s ease-in-out; /* Add fade-in effect */
}
.login-card:hover {
  background-color: #f9f9f9; /* Light background color change on hover */
}

/* Left image section */
.login-image {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #4a78ff, #2a4fb7, #1a237e);
  padding: 30px;
  position: relative;
  gap: 15px; /* Add spacing between image and quote */
}

.login-image img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
}

.image-quote {
  position: relative; /* Changed to flow naturally in the layout */
  margin-top: 10px; /* Additional spacing from the images */
  font-size: 18px;
  line-height: 1.4;
  text-align: center;
  font-style: italic;
  color: #fff;
  max-width: 90%; /* Prevent long quotes from overflowing */
}

/* Additional styling for logo in top-left corner of login-image */
.corner-logo {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 50px;
  height: auto;
  z-index: 10;
}

/* Right form section */
.login-form {
  flex: 1;
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.login-form h2 {
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 0;
  color: #333;
}

.form-subtitle {
  font-size: 14px;
  color: #777;
  margin-bottom: 30px;
}

/* Input styles */
.q-input {
  --q-primary: transparent; /* Remove default highlight color */
  --q-primary-focus: transparent; /* Remove focus color */
  border-radius: 12px; /* Make corners rounder */
  padding: 1px; /* Adjust inner spacing */
  background-color: #f9f9f9; /* Optional: Set a background color */
  margin-bottom: 0;
}

.password-toggle-btn {
  width: 24px; /* Set a fixed width */
  height: 24px; /* Set a fixed height */
}

/* Forgot password */
.forgot-password {
  margin-bottom: 30px;
  width: 100%;
  text-align: right;
}
.forgot-password a {
  font-size: 12px;
  color: #4a78ff;
  text-decoration: none;
}
.forgot-password a:hover {
  text-decoration: underline;
}

/* Buttons */
.login-btn {
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
.login-btn:hover {
  background: linear-gradient(40deg, #2a4fb7, #1a237e);
}
.login-btn:focus {
  outline: 2px solid #4a78ff;
  outline-offset: 2px;
}

/* Social login */
.google-login {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  background: #f4f4f4;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 20px;
}
.google-login:hover {
  background: #f0f0f0;
}
.google-login img {
  width: 20px;
  margin-right: 10px;
}

/* Signup text */
.signup-text {
  font-size: 14px;
  color: #777;
  margin-top: 20px;
}

/* Signup link styling */
.signup-link {
  color: #4a78ff; /* Link color */
  text-decoration: none; /* Remove underline */
  font-weight: 600;
  margin-left: 5px; /* Space between text and link */
  cursor: pointer;
}

.signup-link:hover {
  text-decoration: underline; /* Add underline on hover */
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 20px 0;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #ddd;
}
.divider span {
  padding: 0 10px;
  font-size: 14px;
  color: #777;
}

/* Animation for the container */
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
  .login-card {
    flex-direction: column;
  }

  .login-image {
    flex: none;
    padding: 30px;
    text-align: center;
  }

  .login-image img {
    max-width: 150px; /* Resize image for smaller screens */
    height: auto;
  }

  .image-quote {
    position: static; /* Allow quote to flow normally */
    margin-top: 10px; /* Add spacing */
    font-size: 16px; /* Adjust font size */
    line-height: 1.4;
  }

  .login-form {
    padding: 30px 20px;
  }

  .logo {
    width: 40px;
  }

  .site-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .login-card {
    flex-direction: column;
  }

  .login-image {
    padding: 25px;
    text-align: center;
  }

  .login-image img {
    max-width: 100px; /* Further resize image for very small screens */
    height: auto;
  }

  .image-quote {
    font-size: 14px; /* Smaller font size */
    line-height: 1.3; /* Adjust spacing for small screens */
    margin-top: 8px;
  }

  .login-form {
    padding: 20px;
    font-size: 20px;
  }

  .form-subtitle {
    font-size: 12px;
  }

  .q-input {
    padding: 10px;
    font-size: 12px;
  }

  .login-btn {
    font-size: 14px;
    padding: 10px;
  }

  .google-login {
    font-size: 12px;
  }
}
</style>
