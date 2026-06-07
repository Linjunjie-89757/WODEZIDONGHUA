import { defineStore } from 'pinia';

import { userApi, type UserProfile } from '@entities/user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null as UserProfile | null,
    bootstrapped: false,
    loading: false
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.currentUser)
  },
  actions: {
    setCurrentUser(user: UserProfile) {
      this.currentUser = user;
      this.bootstrapped = true;
    },
    clearCurrentUser() {
      this.currentUser = null;
      this.bootstrapped = true;
    },
    async bootstrap() {
      if (this.bootstrapped || this.loading) {
        return this.currentUser;
      }

      this.loading = true;

      try {
        const user = await userApi.me();
        this.currentUser = user;
        return user;
      } catch {
        this.currentUser = null;
        return null;
      } finally {
        this.bootstrapped = true;
        this.loading = false;
      }
    }
  }
});
