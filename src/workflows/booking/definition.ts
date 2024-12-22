import { IBooking, IConsultationBooking } from 'src/entities';
import { Struct } from 'src/structs';

export type Booking =
  | Struct<
      'bookAppointment',
      {
        payload: IBooking;
        success(booking: IBooking): void;
        error?: ErrorCallback;
      }
    >
  | Struct<
      'rejectConsultation',
      {
        payload: {
          booking: IConsultationBooking;
          reason: string;
        };
        success(booking: IBooking): void;
        error?: ErrorCallback;
      }
    >
  | Struct<
      'updateBooking',
      {
        payload: {
          booking: IBooking;
          fields: (keyof IBooking | string)[];
        };
        success(booking: IBooking): void;
        error?: ErrorCallback;
      }
    >
  | Struct<
      'cancelBooking',
      {
        payload: {
          booking: IBooking;
        };
        success(booking: IBooking): void;
        error?: ErrorCallback;
      }
    >;
