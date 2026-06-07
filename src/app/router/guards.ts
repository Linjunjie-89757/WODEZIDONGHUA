import type { Router } from 'vue-router';

import { useAuthStore } from '@features/auth-login';
import { useWorkspaceStore } from '@entities/workspace';
import { appEnv } from '@shared/config/env';

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    const workspaceStore = useWorkspaceStore();

    if (to.meta.public || appEnv.devAuthBypass) {
      return true;
    }

    if (!authStore.bootstrapped) {
      await authStore.bootstrap();
    }

    if (authStore.isAuthenticated) {
      await workspaceStore.ensureSwitchableLoaded();
      return true;
    }

    return {
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    };
  });
}
