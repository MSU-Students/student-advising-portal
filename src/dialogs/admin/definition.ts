import { Struct } from 'src/structs';

export type ApplicationActions = Struct<
  'applicationRejectDialog',
  {
    success?: VoidCallback;
    error?: ErrorCallback;
  }
>;
