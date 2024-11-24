import { IProfile } from './profile.entities';

export interface IRequest {
  key: string;
  role: 'student' | 'adviser' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  data: IProfile;
}
