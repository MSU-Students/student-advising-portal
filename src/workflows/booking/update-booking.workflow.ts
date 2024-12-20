import { firebaseService } from 'src/services/firebase.service';
import { TheWorkflows } from '../the-workflows';
import { IBooking, IProfile } from 'src/entities';
import { date } from 'quasar';

TheWorkflows.on({
  type: 'updateBooking',
  loggable: 'operation',
  async cb(e) {
    try {
      if (e.payload.booking.key) {
        let update: Partial<IBooking>;
        if (e.payload.booking.type == 'appointment') {
          const invited = e.payload.booking.invited as IProfile[];
          update = {
            date: date.formatDate(e.payload.booking.date, 'YYYY-MM-DD'),
            time: e.payload.booking.time || '08:00',
            title: e.payload.booking.title,
            description: e.payload.booking.description || '',
            duration: e.payload.booking.duration || '1h',
            invited: [...invited.map((i) => i.key || '')],
          };
        } else {
          const advisee = e.payload.booking.advisee as IProfile;
          const adviser = e.payload.booking.adviser as IProfile;
          update = {
            date: date.formatDate(e.payload.booking.date, 'YYYY-MM-DD'),
            time: e.payload.booking.time || '08:00',
            duration: e.payload.booking.duration || '1h',
            description: e.payload.booking.description,
            advisee: advisee?.key,
            title: e.payload.booking.title,
            adviser: adviser?.key,
          };
        }
        type Model = Parameters<typeof firebaseService.update>[2];
        await firebaseService.update(
          'bookings',
          e.payload.booking.key,
          update as unknown as Model
        );
        e.success?.(e.payload.booking);
      }
    } catch (error) {
      e.error?.(new Error(String(error)));
    }
  },
});
