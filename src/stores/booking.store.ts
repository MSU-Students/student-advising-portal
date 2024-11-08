import { defineStore } from 'pinia';

export const useBookingStore = defineStore('booking', {
  state: () => ({
    booking: 0,
  }),
  getters: {

  },
  actions: {
    increment() {
      this.booking++;
    },
  },
});
