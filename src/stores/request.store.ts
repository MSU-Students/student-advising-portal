import { defineStore } from 'pinia';
import { IRequest } from 'src/entities/requests.entites';
import { firebaseService } from 'src/services/firebase.service';

export const useRequestStore = defineStore('requests', {
  state: () => ({
    requests: [] as IRequest[],
  }),

  actions: {
    async createRequest(request: IRequest) {
      return await firebaseService.create('requests', request);
    },
    streamRequests(filter?: Record<string, string>) {
      firebaseService.streamWith('requests', filter).subscribe({
        next: (records) => {
          this.requests = records as IRequest[];
        },
      });
    },
  },
});
