import { defineStore } from 'pinia';
import { IBooking } from 'src/entities';
import { firebaseService } from 'src/services/firebase.service';

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookings: [] as IBooking[],
  }),
  getters: {},
  actions: {
    async bookAppointment(payload: IBooking) {
      const result = await firebaseService.create('bookings', payload);
      this.bookings.push(result as IBooking);
      return result as IBooking;
    },
    async findAll(filter?: Partial<IBooking>) {
      const result = await firebaseService.findAll(
        'bookings',
        filter as Record<string, string>
      );
      this.bookings = result as IBooking[];
    },
    streamWith(filter?: Partial<IBooking>) {
      return firebaseService
        .streamWith('bookings', filter as Record<string, string>)
        .subscribe({
          next: (value) => {
            this.bookings = value as IBooking[];
          },
        });
    },
  },
});
