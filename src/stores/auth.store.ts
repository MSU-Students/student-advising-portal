import { defineStore } from 'pinia';
import { IProfile } from 'src/entities';
import { firebaseService } from 'src/services/firebase.service';
import { useProfileStore } from './profile.store';
import { User } from 'firebase/auth';
import { SignUpPayload } from 'src/workflows/auth/definition';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: undefined as IProfile | undefined,
  }),

  getters: {},

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
      };
      return (await profileStore.register(this.currentUser)) as IProfile;
    },
    async getUser() {
      const user =
        (await firebaseService.auth()) ||
        (await firebaseService.authenticate());
      const profileStore = useProfileStore();
      if (user) {
        this.currentUser =
          (await profileStore.getProfile(user.uid)) ||
          (await this.registerCurrentUser(user));
        this.currentUser.emailVerified = user.emailVerified;
      } else {
        this.currentUser = undefined;
      }
      return this.currentUser;
    },
    async signUpAccount(payload: SignUpPayload) {
      await firebaseService.createUserWithEmailPass(
        payload.email,
        payload.password
      );
      await firebaseService.updateProfile(
        `${payload.firstName} ${payload.middleName} ${payload.lastName}`
      );
    },
    async resendEmailVerification() {
      await firebaseService.resendEmailVerification();
    },
    async resetPassword(email: string) {
      await firebaseService.forgetPassword(email);
    }
  },
});
