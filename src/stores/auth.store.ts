import { defineStore } from 'pinia';
import { IProfile } from 'src/entities';
import { firebaseService } from 'src/services/firebase.service';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: undefined as IProfile | undefined
  }),

  getters: {

  },

  actions: {
    async loginWithGoogle() {
      const credential = await firebaseService.signInWithGoogleAccount();
      this.currentUser = {
        type: 'student',
        fullName: credential.user.displayName || '',
        avatar: credential.user.photoURL || '',
        foreign: false,
      }
    }
  }
});
