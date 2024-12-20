<!-- this sir is when adding reason and suggestion after rejecting appointment -->
<template>
    <div>
      <!-- Add Reason/Suggestion Button -->
      <q-btn
        flat
        round
        color="primary"
        icon="add"
        label="Add Reason/Suggestion"
        class="q-mt-sm"
        @click="showReasonDialog = true"
      />
  
      <!-- Add Reason/Suggestion Dialog -->
      <q-dialog v-model="showReasonDialog" persistent>
        <q-card style="max-width: 500px">
          <q-card-section>
            <div class="text-h6">Add Reason/Suggestion</div>
            <div class="text-body2 q-mt-sm">
              Please provide a reason or suggestion for rejecting the appointment.
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="rejectionReason"
              label="Reason/Suggestion"
              type="textarea"
              filled
              clearable
              placeholder="Write the reason here..."
              class="q-mb-md"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="secondary" @click="closeReasonDialog" />
            <q-btn
              label="Submit"
              color="primary"
              :disable="!rejectionReason.trim()"
              @click="submitReason"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showReasonDialog: false, // Controls visibility of the reason dialog
        rejectionReason: '', // Stores the input reason or suggestion
      };
    },
    methods: {
      closeReasonDialog() {
        this.showReasonDialog = false;
        this.rejectionReason = ''; // Clear input
      },
      submitReason() {
        this.showReasonDialog = false;
  
        // Notify the user that the reason was added
        this.$q.notify({
          type: 'positive',
          message: 'Reason added successfully!',
          icon: 'check_circle',
        });
  
        // Optionally, send the reason to the backend
        console.log('Rejection Reason:', this.rejectionReason);
  
        // Reset input field
        this.rejectionReason = '';
      },
    },
  };
  </script>
  
  <style scoped>
  .text-h6 {
    font-weight: bold;
  }
  </style>
  