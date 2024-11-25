import { Struct } from 'src/structs';

export type AccountApplication =
  | Struct<
      'adminApplicationDialog',
      {
        success?: VoidCallback;
        error?: ErrorCallback;
      }
    >
  | Struct<
      'studentApplicationDialog',
      {
        success?: VoidCallback;
        error?: ErrorCallback;
      }
    >
  | Struct<
      'adviserApplicationDialog',
      {
        success?: VoidCallback;
        error?: ErrorCallback;
      }
    >;
