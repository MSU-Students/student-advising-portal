import { defineStore } from 'pinia';
import {
  IAdviserProfile,
  IAppointmentBooking,
  IBooking,
  IConsultationBooking,
  IProfile,
  IStudentProfile,
} from 'src/entities';
import { firebaseService } from 'src/services/firebase.service';
import { useProfileStore } from './profile.store';

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookings: [] as IBooking[],
    consulations: [] as IConsultationBooking[],
    appointments: [] as IAppointmentBooking[],
  }),
  getters: {},
  actions: {
    async bookAppointment(payload: IBooking) {
      const result = await firebaseService.create('bookings', payload);
      if (!this.bookings.find((b) => b.key == result?.key)) {
        this.bookings.push(result as IBooking);
      }
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
            this.bookings = (value || []) as IBooking[];
          },
        });
    },
    streamAppointmentsWith(filter?: Record<string, string | undefined>) {
      const profileStore = useProfileStore();
      filter = filter || {};
      filter.type = 'appointment';
      return firebaseService
        .streamWith('bookings', filter as Record<string, string>)
        .subscribe({
          next: async (value) => {
            this.appointments = await Promise.all(
              ((value || []) as IAppointmentBooking[]).map(async (booking) => {
                if (typeof booking.bookedBy == 'string') {
                  booking.bookedBy = (await profileStore.getProfile(
                    booking.bookedBy
                  )) as IProfile;
                }
                return booking;
              })
            );
          },
        });
    },
    streamConsulationsWith(filter?: Record<string, string | undefined>) {
      const profileStore = useProfileStore();
      filter = filter || {};
      filter.type = 'consultation';
      return firebaseService
        .streamWith('bookings', filter as Record<string, string>)
        .subscribe({
          next: async (value) => {
            this.consulations = await Promise.all(
              ((value || []) as IConsultationBooking[]).map(async (booking) => {
                if (typeof booking.advisee == 'string') {
                  booking.advisee = (await profileStore.getProfile(
                    booking.advisee
                  )) as IStudentProfile;
                }
                if (typeof booking.adviser == 'string') {
                  booking.adviser = (await profileStore.getProfile(
                    booking.adviser
                  )) as IAdviserProfile;
                }
                if (typeof booking.bookedBy == 'string') {
                  booking.bookedBy = (await profileStore.getProfile(
                    booking.bookedBy
                  )) as IProfile;
                }
                return booking;
              })
            );
          },
        });
    },
    async rejectBooking(booking: IBooking) {
      if (!booking.key) return;
      return await firebaseService.patch(
        'bookings',
        booking.key,
        'status',
        'rejected'
      );
    },
  },
});
