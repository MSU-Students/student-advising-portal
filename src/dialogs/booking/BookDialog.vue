<template>
  <q-table
    v-if="isBookingAppear"
    :rows="bookings"
    :columns="columns"
    class="q-pa-md q-gutter-sm"
  >
    <template #top-right>
      <q-btn
        @click="bookAppointment"
        class="bg-primary text-white"
        style="margin-right: 10px"
        >Book</q-btn
      >
      <q-btn
        class="bg-red close-btn text-white"
        @click="disappearBookingDialog"
      >
        <!-- <q-icon name="close" color="white" /> -->CANCEL
      </q-btn>
    </template>
  </q-table>
</template>
