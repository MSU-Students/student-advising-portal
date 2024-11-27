<template>
  <q-page class="login-container">
    <!-- Header title -->
    <div class="text-center q-mb-lg">
      <h1 class="site-title">Student Advising Portal</h1>
    </div>

    <!-- Login card -->
    <q-card bordered flat class="login-card">
      <q-card-section>
        <div class="row q-col-gutter-lg">
          <!-- Left section with image and quote -->
          <div class="col-12 col-md-6 login-image text-center">
            <q-img
              src="/src/assets/SAPlogo.png"
              alt="SAP Logo"
              class="corner-logo"
            />
            <q-img src="/src/assets/CICSlogo.png" alt="CICS Logo" />
            <p class="image-quote q-mt-md">
              “Where questions meet answers—your portal to personalized
              advising.”
            </p>
          </div>

          <!-- Right section with form -->
          <div class="col-12 col-md-6 login-form">
            <h2 class="q-mb-md">Welcome</h2>
            <p class="form-subtitle q-mb-lg">Sign in to continue</p>

            <!-- Form -->
            <q-form class="q-gutter-sm">
              <q-input
                filled
                v-model="username"
                label="Username"
                placeholder="Username"
                dense
                required
                class="q-my-md"
              />
              <q-input
                filled
                v-model="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
                dense
                required
                class="q-mb-md"
              />

              <!-- Forgot Password Link -->
              <div class="forgot-password q-mb-md">
                <q-btn flat label="Forgot Password?" />
              </div>

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

            <!-- Signup Section -->
            <p class="signup-text q-mt-lg">
              Don’t have an account?
              <router-link to="/signup" class="signup-link"
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
import { TheWorkflows } from 'src/workflows/the-workflows';
import { useRouter } from 'vue-router';
const $router = useRouter();
const username = '';
const password = '';
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
  font-family: 'Poppins', sans-serif;
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
  flex-direction: row;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  max-width: 900px;
  width: 100%;
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
}
.login-image img {
  max-width: auto;
  height: auto;
  object-fit: cover;
}
.image-quote {
  position: absolute;
  bottom: 20px;
  color: #fff;
  font-size: 18px; /* Adjusted for better readability */
  line-height: 1.4;
  text-align: center;
  font-style: italic;
  width: 80%;
}
/* Additional styling for logo in top-left corner of login-image */
.corner-logo {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 50px;
  height: 5000;
  z-index: 10;
}

/* Right form section */
.login-form {
  padding: 50px 40px;
  color: #000;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.login-form h2 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.form-subtitle {
  font-size: 14px;
  color: #777;
  margin-bottom: 30px;
}

.error-message {
  color: #d9534f;
  background: #f8d7da;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
}

/* Input styles */
.input-group {
  width: 100%;
  margin-bottom: 15px;
  margin-top: 15px;
}
.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: 0.3s;
}
.input-group input:focus {
  border-color: #4a78ff;
  box-shadow: 0 0 8px rgba(74, 144, 226, 0.5);
}

/* Forgot password */
.forgot-password {
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
  color: #2a4fb7;
  font-size: 5px;
}
.forgot-password a {
  font-size: 8px;
  color: #3a68f3;
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

/* Responsive styles */
@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
  }

  .login-image {
    padding: 20px;
    text-align: center; /* Center-align content */
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
    padding: 15px;
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

  .login-form h2 {
    font-size: 20px;
  }

  .form-subtitle {
    font-size: 12px;
  }

  .input-group input {
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
