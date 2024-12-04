import { theBus } from 'src/the-bus';
import { ToEmit, ToType } from 'src/structs';
import { Auth } from './auth/definition';
import { AccountApplication } from './account-application/definition';
import { ApplicationActions } from './admin/definition';

export type DialogStructs = Auth | AccountApplication | ApplicationActions;

type DialogEvents = ToEmit<DialogStructs, DialogStructs>;
export type WorkflowTypes = ToType<DialogStructs, DialogStructs>;
export const TheDialogs = {
  on(desc: DialogEvents) {
    theBus.off(desc.type, desc.cb as VoidFunction);
    theBus.off(desc.type);
    theBus.on(desc.type, desc.cb as VoidFunction);
  },
  off(desc: DialogEvents) {
    theBus.off(desc.type);
  },
  emit(desc: DialogStructs) {
    theBus.emit(desc.type, desc.arg);
  },
};
