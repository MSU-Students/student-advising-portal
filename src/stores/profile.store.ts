import { defineStore } from 'pinia';
import { IProfile } from 'src/entities';
import { firebaseService } from 'src/services/firebase.service';

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profiles: [] as IProfile[],
  }),

  actions: {
    async register(profile: IProfile) {
      return await firebaseService.create('profiles', profile);
    },
    async getProfile(key: string) {
      try {
        return (await firebaseService.get('profiles', key)) as IProfile;
      } catch {
        return;
      }
    },
    async findProfiles(keyword: string) {
      return ((await firebaseService.findAll('profiles')) as IProfile[]).filter(
        (profile) => {
          return (
            profile.type == 'adviser' &&
            profile.fullName.toLowerCase().match(keyword.toLowerCase())
          );
        }
      );
    },
    streamProfiles(filter?: Record<string, string>) {
      return firebaseService.streamWith('profiles', filter).subscribe({
        next: (records) => {
          this.profiles = records as IProfile[];
        },
      });
    },
  },
});
