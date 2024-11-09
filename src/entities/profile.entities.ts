import { IBaseEntity } from './base.entity';

export interface IProfileBase extends IBaseEntity {
  fullName: string;
  avatar: string;
  email?: string;
}

export interface IStudentProfile extends IProfileBase {
  type: 'student';
  foreign: boolean;
}

export interface IAdviserProfile extends IProfileBase {
  type: 'adviser';
  primary: boolean;
}

export interface IAdminProfile extends IProfileBase {
  type: 'admin';
}


export interface IAnonymousProfile extends IProfileBase {
  type: 'anonymous';
}


export type IProfile = IStudentProfile | IAdviserProfile | IAdminProfile | IAnonymousProfile;

