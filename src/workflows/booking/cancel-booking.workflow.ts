import { useBookingStore } from 'src/stores/booking.store';
import { TheWorkflows } from '../the-workflows';

TheWorkflows.on({
  type: 'cancelBooking',
  async cb(e) {
    try {
      if (!e.payload.booking.key) return;
      const bookingStore = useBookingStore();

      const booking = await bookingStore.getBooking(e.payload.booking.key);
      if (!booking) return;
      await bookingStore.cancelBooking(e.payload.booking);
      e?.success({
        ...e.payload.booking,
        status: 'cancelled',
      });
    } catch (error) {
      e.error?.(new Error(String(error)));
    }
  },
});
