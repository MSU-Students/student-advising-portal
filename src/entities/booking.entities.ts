import { IBaseEntity } from './base.entity';
import { IAdviserProfile, IProfile, IStudentProfile } from './profile.entities';

export interface IBookingBase extends IBaseEntity {
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  time: string;
  date: string;
  title: string;
  description?: string;
  duration?: string;
  location?: string;
  dateBooked?: string;
  bookedBy?: IProfile | string;
}

export interface IAppointmentBooking extends IBookingBase {
  type: 'appointment';
  invited?: (string | IProfile)[];
  accepted?: (string | IProfile)[];
  attendees?: (string | IProfile)[];
}

export interface IConsultationBooking extends IBookingBase {
  type: 'consultation';
  adviser?: string | IAdviserProfile;
  advisee?: string | IStudentProfile;
}

export type IBooking = IAppointmentBooking | IConsultationBooking;
