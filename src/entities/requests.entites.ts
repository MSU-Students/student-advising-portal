import { IProfile } from './profile.entities';

export interface IRequest {
  key: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  data: IProfile;
}
