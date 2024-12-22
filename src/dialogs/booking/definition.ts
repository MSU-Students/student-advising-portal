import { IBooking, IConsultationBooking } from 'src/entities';
import { Struct } from 'src/structs';

export type Booking =
  | Struct<
      'bookAppointmentDialog',
      {
        payload?: {
          date: string;
          time: string;
        };
        success(booking: IBooking): void;
        error?: ErrorCallback;
      }
    >
  | Struct<
      'studentBookingDialog',
      {
        success: VoidCallback;
        error?: ErrorCallback;
      }
    >
  | Struct<
      'rejectConsultationDialog',
      {
        payload: IConsultationBooking;
        success: VoidCallback;
        error?: ErrorCallback;
      }
    >;
