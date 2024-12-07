import { IRequest } from 'src/entities';
import { Struct } from 'src/structs';

export type Admin =
  | Struct<
      'approveApplication',
      {
        payload: IRequest;
        success?: (result: IRequest) => void;
        error?: ErrorCallback;
      }
    >
  | Struct<
      'rejectApplication',
      {
        payload: IRequest;
        success?: (result: IRequest) => void;
        error?: ErrorCallback;
      }
    >;
