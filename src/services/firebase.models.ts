import * as entities from '../entities';

export type Models =
  | entities.IProfile
  | entities.IBooking
  | entities.IRequest
  | entities.TransactionLogs<entities.IBaseEntity>
  | undefined;
