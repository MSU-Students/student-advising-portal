import { defineStore } from 'pinia';
import { IAppointmentBooking, IBooking } from 'src/entities';
import { firebaseService } from 'src/services/firebase.service';

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookings: [] as IBooking[],
  }),
  getters: {
    count(): number {
      return this.bookings.length;
    }
  },
  actions: {
    async bookAppointment(payload: IAppointmentBooking) {
      const result = await firebaseService.create('bookings', payload);
      this.bookings.push(result as IBooking);
    },
  },
});
