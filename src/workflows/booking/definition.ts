import { IBooking } from 'src/entities';
import { Struct } from 'src/structs';

export type Booking = Struct<
  'bookAppointment',
  {
    payload: IBooking;
    success(booking: IBooking): void;
    error?: ErrorCallback;
  }
>;
