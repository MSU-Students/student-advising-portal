import { IBaseEntity } from './base.entity';

export interface IProfileBase extends IBaseEntity {
  fullName: string;
  avatar: string;
  email?: string;
  emailVerified?: boolean;
}

export interface IStudentProfile extends IProfileBase {
  type: 'student';
  idNumber: string;
  program: string;
}

export interface IAdviserProfile extends IProfileBase {
  type: 'adviser';
  college: string;
  department: string;
  position: string;
  employeeID: string;
}

export interface IAdminProfile extends IProfileBase {
  type: 'admin';
}

export interface IAnonymousProfile extends IProfileBase {
  type: 'anonymous';
}

export type IProfile =
  | IStudentProfile
  | IAdviserProfile
  | IAdminProfile
  | IAnonymousProfile;
