import { IRequest } from 'src/entities';
import { Struct } from 'src/structs';

export type ApplicationActions = Struct<
  'applicationRejectDialog',
  {
    payload: IRequest;
    success?: VoidCallback;
    error?: ErrorCallback;
  }
>;
