import { theBus } from 'src/the-bus';
import { ToEmit, ToType } from 'src/structs';
import { Auth } from './auth/definition';
import { Booking } from './booking/definition';

export type WorkflowStructs = Auth | Booking;

type WorkflowEvents = ToEmit<WorkflowStructs, WorkflowStructs>;
export type WorkflowTypes = ToType<WorkflowStructs, WorkflowStructs>;

export const TheWorkflows = {
  on(desc: WorkflowEvents) {
    theBus.off(desc.type, desc.cb as VoidFunction);
    theBus.off(desc.type);
    theBus.on(desc.type, desc.cb as VoidFunction);
  },
  off(desc: WorkflowEvents) {
    theBus.off(desc.type);
  },
  emit(desc: WorkflowStructs) {
    theBus.emit(desc.type, desc.arg);
  },
};
