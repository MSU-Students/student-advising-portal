import { getDocs, query, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { IRequest } from 'src/entities/requests.entites';
import { getCollections } from 'src/services/firebase.collections';
import { fbStore, firebaseService } from 'src/services/firebase.service';

export const useRequestStore = defineStore('requests', {
  state: () => ({
    requests: [] as IRequest[],
  }),

  actions: {
    async createRequest(request: IRequest) {
      return await firebaseService.create('requests', request);
    },

    async getRequest(key: string) {
      const requestRef = getCollections(fbStore).requests();
      const q = query(requestRef, where('data.key', '==', key));
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          return { ...doc.data() } as IRequest;
        }
      } catch {
        return;
      }
    },
  },
});
