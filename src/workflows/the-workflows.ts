import { theBus } from 'src/the-bus';
import { ToEmit, ToType } from 'src/structs';
import { Auth } from './auth/definition';
import { Admin } from './admin/definition';
import { Logs } from './logs/definition';
import { useEmitStore } from 'src/stores/emit.store';

export type WorkflowStructs = Auth | Admin | Logs;

type WorkflowEvents = ToEmit<WorkflowStructs, WorkflowStructs>;
export type WorkflowTypes = ToType<WorkflowStructs, WorkflowStructs>;

export const TheWorkflows = {
  on(desc: WorkflowEvents) {
    theBus.off(desc.type, desc.cb as VoidFunction);
    theBus.off(desc.type);
    theBus.on(desc.type, desc.cb as VoidFunction);
    const emitStore = useEmitStore();
    emitStore.loggable({
      transactionType: desc.type,
      value: desc.loggable || 'console',
      info: {
        icon: desc.icon || 'poll',
        module: desc.module || 'shared',
      },
    });
  },
  off(desc: WorkflowEvents) {
    theBus.off(desc.type);
  },
  emit(desc: WorkflowStructs) {
    theBus.emit(desc.type, desc.arg);
  },
};
