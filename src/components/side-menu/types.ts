export enum MeetingStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}

export interface MeetingDetails {
  id: number;
  name: string;
  emailAddress: string;
  yearLevel: string;
  program: string;
  scheduledDate: string;
  scheduledTime: string;
  requestedDate: string;
  requestedTime: string;
  reason: string;
  status: MeetingStatus;
  subject: string;
}

export interface MenuOptionItem {
  name: string;
  label: string;
  icon: string;
}
