import { useBookingStore } from 'src/stores/booking.store';
import { TheWorkflows } from '../the-workflows';

TheWorkflows.on({
  type: 'bookAppointment',
  async cb(e) {
    const bookingStore = useBookingStore();
    const result = await bookingStore.bookAppointment(e.payload);
    e.success(result);
  },
});
