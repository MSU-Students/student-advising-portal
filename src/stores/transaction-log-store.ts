import { defineStore } from 'pinia';
import { date } from 'quasar';
import { ILoggable } from 'src/entities';
import { firebaseService } from 'src/services/firebase.service';

export const useTransactionLogsStore = defineStore('transactionLogs', {
  state: () =>
    ({
      logs: [],
    } as { logs: ILoggable[] }),
  getters: {},
  actions: {
    async saveTransaction(log: ILoggable) {
      log.key = log.key || `${log.type}:${log.operator}${log.date}`;
      this.logs.push(log);
      return (await firebaseService.create('logs', log)) as ILoggable;
    },

    async findTransactions(filter?: Record<string, string>) {
      return (await firebaseService.findAll('logs', filter)) as ILoggable[];
    },
    deleteTransaction(loggable: ILoggable) {
      return firebaseService.delete('logs', loggable.key);
    },
    async findTransactionsOn(targetDate: string) {
      const from = date.formatDate(targetDate, 'YYYY-MM-DD 00:00');
      const until = date.formatDate(targetDate, 'YYYY-MM-DD 23:59');
      const filter = {
        'date >=': from,
        'date <=': until,
      };
      return await this.findTransactions(filter);
    },
    streamTransactionsOn(startDate: string, endDate: string) {
      const from = date.formatDate(startDate, 'YYYY-MM-DD 00:00');
      const until = date.formatDate(endDate, 'YYYY-MM-DD 23:59');
      const filter = {
        'date >=': from,
        'date <=': until,
      };
      return firebaseService.streamWith('logs', filter);
    },
  },
});
