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
    async approveRequest(request: IRequest) {
      if (request.remarks) {
        await firebaseService.patch(
          'requests',
          request.key,
          'remakrs',
          request.remarks
        );
      }
      return await firebaseService.patch(
        'requests',
        request.key,
        'status',
        'approved'
      );
    },
    async rejectRequest(request: IRequest) {
      if (request.remarks) {
        await firebaseService.patch(
          'requests',
          request.key,
          'remakrs',
          request.remarks
        );
      }
      return await firebaseService.patch(
        'requests',
        request.key,
        'status',
        'rejected'
      );
    },
    streamRequests(filter?: Record<string, string>) {
      return firebaseService.streamWith('requests', filter).subscribe({
        next: (records) => {
          this.requests = records as IRequest[];
        },
      });
    },
  },
});
