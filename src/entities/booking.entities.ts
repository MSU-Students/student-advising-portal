import { IBaseEntity } from './base.entity';
import { IAdviserProfile, IProfile, IStudentProfile } from './profile.entities';

export interface IBookingBase extends IBaseEntity {
  status: 'pending' | 'accepted' | 'cancelled';
  time: string;
  date: string;
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

