import { useBookingStore } from 'src/stores/booking.store';
import { TheWorkflows } from '../the-workflows';

TheWorkflows.on({
  type: 'rejectConsultation',
  loggable: 'operation',
  async cb(e) {
    const bookingStore = useBookingStore();
    await bookingStore.rejectBooking(e.payload.booking);
    e.payload.booking.status = 'rejected';
    e.success?.(e.payload.booking);
  },
});
