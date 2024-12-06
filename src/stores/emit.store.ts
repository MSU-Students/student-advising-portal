import { defineStore } from 'pinia';
interface IEmitStore {
  loggables: Record<
    string,
    'operation' | 'post-operation' | 'query' | 'console'
  >;
  permissions: Record<string, string[]>;
  featureModules: Record<
    string,
    { module: string; icon: string; color?: string }
  >;
}
export const useEmitStore = defineStore('emit', {
  state: () =>
    ({
      loggables: {},
      featureModules: {},
      permissions: {},
    } as IEmitStore),
  getters: {
    list(): string[] {
      return Object.keys(this.loggables);
    },
    listRestricted(): string[] {
      return Object.keys(this.permissions).filter((type) => {
        return this.permissions[type] && this.permissions[type].length > 0;
      });
    },
  },
  actions: {
    loggable(payload: {
      transactionType: string;
      value: 'operation' | 'post-operation' | 'query' | 'console';
      info: {
        module: string;
        icon: string;
        color?: string;
      };
    }) {
      this.loggables[payload.transactionType] =
        typeof payload.value != 'undefined' ? payload.value : 'console';
      this.featureModules[payload.transactionType] = { ...payload.info };
    },
    permissable(payload: { transactionType: string; roles: string[] }) {
      this.permissions[payload.transactionType] = [...payload.roles];
    },
  },
});
