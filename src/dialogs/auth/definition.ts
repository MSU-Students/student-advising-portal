import { Struct } from 'src/structs';

export type Auth =
  | Struct<'logoutDialog', {
    success?: VoidCallback;
    error?: ErrorCallback;
  }>
  | Struct<'confirmLockDialog', {
    success?: VoidCallback;
    error?: ErrorCallback;
  }>
