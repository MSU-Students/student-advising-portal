import { IBaseEntity } from './base.entity';

export interface IProfileBase extends IBaseEntity {
  fullName: string;
  avatar: string;
}

export interface IStudentProfile extends IProfileBase {
  type: 'student';
  foreign: boolean;
}

export interface IAdviserProfile extends IProfileBase {
  type: 'adviser';
  primary: boolean;
}

export type IProfile = IStudentProfile | IAdviserProfile;

