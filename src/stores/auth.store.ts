import { defineStore } from 'pinia';
import { IProfile } from 'src/entities';
import { firebaseService } from 'src/services/firebase.service';
import { useProfileStore } from './profile.store';



export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: undefined as IProfile | undefined
  }),

  getters: {

  },

  actions: {
    async loginWithGoogle() {
      debugger;
      const credential = await firebaseService.signInWithGoogleAccount();
      const profileStore = useProfileStore();
      const profile = await profileStore.getProfile(credential.user.uid);
      if (profile) {
        this.currentUser = profile;
      } else {
        this.currentUser = {
          key: credential.user.uid,
          type: 'anonymous',
          fullName: credential.user.displayName || '',
          avatar: credential.user.photoURL || '',
          email: credential.user.email || '',
        }
        profileStore.register(this.currentUser)
      }

    },
    async getUser() {
      const user = await firebaseService.authenticate();
      const profileStore = useProfileStore();
      if (user) {
        this.currentUser = await profileStore.getProfile(user.uid);
      } else {
        this.currentUser = undefined;
      }
      return this.currentUser;
    }
  }
});
