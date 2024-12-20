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
    async getBooking(key: string) {
      return this.fillBooking(
        (await firebaseService.get('bookings', key)) as IBooking
      );
    },
    async findAll(filter?: Partial<IBooking>) {
      const result = await firebaseService.findAll(
        'bookings',
        filter as Record<string, string>
      );
      this.bookings = result as IBooking[];
    },
    streamWith(filter?: Partial<IBooking>) {
      return firebaseService.streamWith(
        'bookings',
        filter as Record<string, string>
      );
    },
    streamAppointmentsWith(filter?: Record<string, string | undefined>) {
      filter = filter || {};
      filter.type = 'appointment';
      return firebaseService
        .streamWith('bookings', filter as Record<string, string>)
        .subscribe({
          next: async (value) => {
            this.appointments = await Promise.all(
              ((value || []) as IAppointmentBooking[]).map(async (booking) => {
                return this.fillBooking(booking);
              })
            );
          },
        });
    },
    async fillBooking<B extends IBooking>(booking: B) {
      const profileStore = useProfileStore();
      if (booking.type == 'consultation') {
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
      } else if (booking.type == 'appointment') {
        booking.invited = await Promise.all(
          (booking.invited || []).map(async (p) => {
            if (typeof p == 'string') {
              return (await profileStore.getProfile(p)) || p;
            }
            return p;
          })
        );
      }
      if (typeof booking.bookedBy == 'string') {
        booking.bookedBy = (await profileStore.getProfile(
          booking.bookedBy
        )) as IProfile;
      }
      return booking;
    },
    streamConsulationsWith(filter?: Record<string, string | undefined>) {
      filter = filter || {};
      filter.type = 'consultation';
      return firebaseService
        .streamWith('bookings', filter as Record<string, string>)
        .subscribe({
          next: async (value) => {
            this.consulations = await Promise.all(
              ((value || []) as IConsultationBooking[]).map(async (booking) => {
                return this.fillBooking(booking);
              })
            );
          },
        });
    },
  },
});
