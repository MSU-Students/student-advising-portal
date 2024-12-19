<template>
    <div>
      <!-- Button to reject the appointment -->
      <q-btn color="negative" label="Reject Appointment" @click="rejectAppointment" />
  
      <!-- Add Reason/Suggestion Dialog -->
      <q-dialog v-model="isReasonDialogVisible" persistent>
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
        isReasonDialogVisible: false, // Controls visibility of reason dialog
        rejectionReason: '', // Stores the input reason or suggestion
      };
    },
    methods: {
      rejectAppointment() {
        // Simulate rejection action
        this.$q.notify({
          type: 'negative',
          message: 'Appointment rejected!',
          icon: 'warning',
        });
  
        // Open the reason dialog
        this.isReasonDialogVisible = true;
      },
      closeReasonDialog() {
        this.isReasonDialogVisible = false;
        this.rejectionReason = ''; // Clear the reason input
      },
      submitReason() {
        // Close the reason dialog
        this.isReasonDialogVisible = false;
  
        // Notify the adviser that the reason has been submitted
        this.$q.notify({
          type: 'positive',
          message: 'Reason submitted successfully!',
          icon: 'check_circle',
        });
  
        // Optionally, send the reason to the backend
        console.log('Rejection Reason:', this.rejectionReason);
  
        // Reset the reason input
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
  