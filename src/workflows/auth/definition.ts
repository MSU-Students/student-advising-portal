import { Struct } from 'src/structs';

export type Auth =
  Struct<'loginWithGoogle', {
    success: VoidCallback;
    error?: ErrorCallback;
  }>
  | Struct<'logOut', {
    success: VoidCallback;
    error: ErrorCallback;
  }>
