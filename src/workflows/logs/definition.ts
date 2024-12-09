import { ILoggable } from 'src/entities/transaction-log.entities';
import { Struct } from 'src/structs';

export type Logs =
  | Struct<'logTransaction', {
    log: ILoggable
  }>
  | Struct<'registerLoggable', {
    transactionType: string,
    value?: 'operation' | 'query' | 'console';
  }>
