import { defineStore } from 'pinia';

import type { UserProfile } from './types';

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as UserProfile | null
  }),
  actions: {
    setProfile(profile: UserProfile | null) {
      this.profile = profile;
    }
  }
});
