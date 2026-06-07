import { useRouter } from 'vue-router';

import { useWorkspaceStore } from '@entities/workspace';
import { useAuthStore } from '@features/auth-login';
import { endpoints } from '@shared/api/endpoints';
import { request } from '@shared/api/request';

export function useLogout() {
  const router = useRouter();
  const authStore = useAuthStore();
  const workspaceStore = useWorkspaceStore();

  async function logout() {
    await request.post(endpoints.auth.logout);
    authStore.clearCurrentUser();
    workspaceStore.reset();
    await router.push('/login');
  }

  return {
    logout
  };
}
