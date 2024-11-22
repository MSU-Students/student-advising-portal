import { defineStore } from 'pinia';
import { IProfile } from 'src/entities';
import { firebaseService } from 'src/services/firebase.service';
import { useProfileStore } from './profile.store';
import { User } from 'firebase/auth';



export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: undefined as IProfile | undefined
  }),

  getters: {

  },

  actions: {
    async loginWithGoogle() {
      const credential = await firebaseService.signInWithGoogleAccount();
      const profileStore = useProfileStore();
      const profile = await profileStore.getProfile(credential.user.uid);
      if (profile) {
        this.currentUser = profile;
      } else {

      }

    },
    async registerCurrentUser(user: User) {
      const profileStore = useProfileStore();
      this.currentUser = {
        key: user.uid,
        type: 'anonymous',
        fullName: user.displayName || '',
        avatar: user.photoURL || '',
        email: user.email || '',
      }
      return await profileStore.register(this.currentUser) as IProfile;
    },
    async getUser() {
      const user = await firebaseService.auth()
        || await firebaseService.authenticate();
      const profileStore = useProfileStore();
      if (user) {
        this.currentUser = await profileStore.getProfile(user.uid)
          || await this.registerCurrentUser(user);
      } else {
        this.currentUser = undefined;
      }
      return this.currentUser;
    }
  }
});
