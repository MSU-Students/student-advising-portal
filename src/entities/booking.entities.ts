import { IBaseEntity } from './base.entity';
import { IAdviserProfile, IProfile, IStudentProfile } from './profile.entities';

export interface IBookingBase extends IBaseEntity {
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  time: string;
  date: string;
  description: string;
  duration?: string;
  location?: string;
  author?: IProfile | string;
}

export interface IAppointmentBooking extends IBookingBase {
  type: 'appointment';
  invited: IProfile[];
  accepted: IProfile[];
  attendees: IProfile[];
}

export interface IConsultationBooking extends IBookingBase {
  type: 'consultation';
  adviser: IAdviserProfile;
  advisee: IStudentProfile;
}

export type IBooking = IAppointmentBooking | IConsultationBooking;
