import { Struct } from 'src/structs';

export type Auth =
  | Struct<'logoutDialog', {
    success?: VoidCallback;
    error?: ErrorCallback;
  }>
