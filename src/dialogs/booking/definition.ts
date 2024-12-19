import { IBooking, IConsultationBooking } from 'src/entities';
import { Struct } from 'src/structs';

export type Booking =
  | Struct<
      'bookAppointmentDialog',
      {
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
      'rejectConsulationDialog',
      {
        payload: IConsultationBooking;
        success: VoidCallback;
        error?: ErrorCallback;
      }
    >;
