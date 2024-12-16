<template>
  <div class="login-container">
    <!-- Header title -->
    <h1 class="site-title">Student Advising Portal</h1>

    <!-- Sign-Up card -->
    <div class="login-card">
      <!-- Left section with image and quote -->
      <div class="login-image">
        <q-img src="~/assets/SAPlogo.png" alt="SAP Logo" class="corner-logo" />

        <q-img src="~/assets/CICSlogo.png" alt="CICS Logo" />
        <p class="image-quote">
          “Where questions meet answers—your portal to personalized advising.”
        </p>
      </div>

      <!-- Right section with form -->
      <div class="form-side">
        <div class="form-card">
          <h1>Sign Up</h1>
          <q-form @submit="handleSignUp">
            <div class="input-group">
              <q-input
                type="text"
                v-model="firstname"
                placeholder="First Name"
                required
              />
            </div>
            <div class="input-group">
              <q-input
                type="text"
                v-model="middlename"
                placeholder="Middle Name"
                required
              />
            </div>
            <div class="input-group">
              <q-input
                type="text"
                v-model="lastname"
                placeholder="Last Name"
                required
              />
            </div>
            <div class="input-group">
              <q-input
                type="email"
                v-model="email"
                placeholder="Email"
                :rules="['email']"
                class="form-input"
              />
            </div>
            <div class="input-group">
              <q-input
                type="password"
                v-model="password"
                placeholder="Password"
                :rules="[
                  (val:string) => val.length >= 8 || 'Password too short',
                  (val:string) => /\d/.test(val) || 'Should contain number'
                ]"
              />
            </div>
            <div class="input-group">
              <q-input
                type="password"
                v-model="confirmPassword"
                placeholder="Confirm Password"
                :rules="[
                  (val:string) => val == password || 'Password did not match',
                ]"
              />
            </div>
            <div class="input-group"></div>

            <q-uploader label="Avatar" v-model="avatar" />
            <div v-if="avatar" class="avatar-preview">
              <img :src="avatar" alt="Avatar Preview" class="avatar-image" />
              <q-btn icon="delete" round>Remove Avatar</q-btn>
            </div>
            <div v-else class="avatar-placeholder"></div>
            <div class="signup-button-container">
              <q-btn type="submit" class="signup-btn">Sign Up</q-btn>
            </div>
          </q-form>
          <p class="signup-footer">
            Already have an account? <a href="/">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { TheWorkflows } from 'src/workflows/the-workflows';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const firstname = ref('');
const middlename = ref('');
const lastname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const avatar = ref<File>();
const $router = useRouter();
async function handleSignUp() {
  debugger;
  TheWorkflows.emit({
    type: 'signUpWithEmail',
    arg: {
      payload: {
        email: email.value,
        firstName: firstname.value,
        lastName: lastname.value,
        middleName: middlename.value,
        password: password.value,
        avatar: avatar.value,
      },
      success() {
        $router.replace({
          name: 'email-verify',
        });
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

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #eeeeee;
  padding: 20px;
  color: #333;
}

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

.corner-logo {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 50px;
  height: auto;
  z-index: 10;
}

.form-side {
  flex: 1;
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

h1 {
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.input-group {
  width: 100%;
  margin-bottom: 15px;
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

.signup-btn {
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
.signup-btn:hover {
  background: linear-gradient(40deg, #2a4fb7, #1a237e);
}

.signup-footer {
  font-size: 14px;
  color: #777;
  margin-top: 20px;
}

.signup-footer a {
  color: #4a78ff; /* Link color */
  text-decoration: none; /* Remove underline */
  font-weight: 600;
  margin-left: 5px; /* Space between text and link */
  cursor: pointer;
}

.signup-footer a:hover {
  text-decoration: underline;
}

/* Responsive styles */
@media (max-width: 768px) {
  .login-card {
    flex-direction: column; /* Stack the sections vertically */
  }

  .login-image {
    padding: 30px;
    text-align: center; /* Center-align content for smaller screens */
  }

  .login-image img {
    max-width: 150px; /* Resize image for tablets and small laptops */
    height: auto;
  }

  .image-quote {
    position: static; /* Allow quote to flow naturally */
    margin-top: 10px;
    font-size: 16px; /* Adjust font size for better readability */
    line-height: 1.4;
  }

  .form-side {
    padding: 30px 20px; /* Adjust padding for compact screens */
  }

  .logo {
    width: 40px;
  }

  .site-title {
    font-size: 1.5rem; /* Shrink site title for smaller screens */
  }
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

@media (max-width: 480px) {
  .login-card {
    flex-direction: column; /* Ensure vertical stacking */
  }

  .login-image {
    padding: 15px;
    text-align: center; /* Maintain center alignment */
  }

  .login-image img {
    max-width: 100px; /* Reduce image size for very small screens */
    height: auto;
  }

  .image-quote {
    font-size: 14px; /* Further reduce font size for quotes */
    line-height: 1.3; /* Tighter line spacing */
    margin-top: 8px;
  }

  .site-title {
    font-size: 1.2rem; /* Adjust title font size for smaller screens */
  }

  .input-group input {
    padding: 10px;
    font-size: 12px; /* Shrink input font size for compact design */
  }

  .signup-btn {
    font-size: 14px;
    padding: 10px; /* Adjust button size for touch-friendly experience */
    margin-top: 20px;
  }

  .signup-footer {
    font-size: 12px; /* Shrink footer text size */
    margin-top: 15px;
  }
}
.avatar-placeholder {
  height: 5px;
  margin-bottom: 5px;
}
</style>
