import { useBookingStore } from 'src/stores/booking.store';
import { TheWorkflows } from '../the-workflows';
import { date } from 'quasar';
import { IBooking, IProfile } from 'src/entities';

TheWorkflows.on({
  type: 'bookAppointment',
  async cb(e) {
    const bookingStore = useBookingStore();
    const author = e.payload.bookedBy as IProfile;

    let booking: IBooking;

    if (e.payload.type == 'consultation') {
      const advisee = e.payload.advisee as IProfile;
      const adviser = e.payload.adviser as IProfile;
      booking = {
        type: 'consultation',
        date: date.formatDate(e.payload.date, 'YYYY-MM-DD'),
        time: e.payload.time || '08:00',
        status: 'pending',
        duration: e.payload.duration || '1h',
        description: e.payload.description,
        advisee: advisee?.key,
        adviser: adviser?.key,
      };
    } else {
      const invited = e.payload.invited as IProfile[];
      booking = {
        type: 'appointment',
        date: date.formatDate(e.payload.date, 'YYYY-MM-DD'),
        time: e.payload.time || '08:00',
        status: 'pending',
        description: e.payload.description || '1h',
        duration: e.payload.duration,
        invited: [...invited.map(i => i.key)],
        accepted: [],
        attendees: [],
      };
    }
    booking.dateBooked = date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
    booking.bookedBy = author.key;
    booking.key = `${booking.type}:${date.formatDate(new Date(), 'YYYY-MM-DD:HH:mm:ss')}:${author.key}`
    const result = await bookingStore.bookAppointment(booking);
    e.success(result);
  },
});
