import { defineStore } from 'pinia';
import { IProfile } from 'src/entities';

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profiles: [{
      type: 'student',
      avatar: '',
      foreign: false,
      fullName: 'Luffy'
    }] as IProfile[],
  }),

  actions: {

  },
});
