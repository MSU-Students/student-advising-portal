import { IBooking } from 'src/entities';
import { Struct } from 'src/structs';

export type Booking = Struct<
  'bookAppointmentDialog',
  {
    success(booking: IBooking): void;
    error?: ErrorCallback;
  }
>;

export type Book = Struct<
  'bookDialog',
  {
    success(booking: IBooking): void;
    error?: ErrorCallback;
  }
>
