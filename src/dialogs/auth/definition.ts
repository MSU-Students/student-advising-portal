import { Struct } from 'src/structs';

export type Auth =
  | Struct<
      'logoutDialog',
      {
        success?: VoidCallback;
        error?: ErrorCallback;
      }
    >
  | Struct<
      'confirmLockDialog',
      {
        success?: VoidCallback;
        error?: ErrorCallback;
      }
    >;

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
