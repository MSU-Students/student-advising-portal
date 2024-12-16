/* eslint-disable @typescript-eslint/no-explicit-any */

export type Struct<E extends string, A> = {
  type: E,
  arg: A
};
export type EmitStruct<T extends { type: string; arg: A }, A = T['arg']> = {
  type: T['type'];
  loggable?: 'operation' | 'post-operation' | 'query';
  module?: string;
  icon?: string;
  cb: ((e: A) => void) | ((e: A) => Promise<void>);
};

export type ToEmit<T extends { type: string; arg: any }, U> = T extends U
  ? EmitStruct<T>
  : never;
export type ToType<T extends { type: string; arg: any }, U> = T extends U
  ? T['type']
  : never;
