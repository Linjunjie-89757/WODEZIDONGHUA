import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

import { loginApi } from '../api/loginApi';
import { useAuthStore } from './auth.store';

export function useLogin() {
  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  const workspaceStore = useWorkspaceStore();
  const loading = ref(false);
  const form = reactive({
    username: '',
    password: ''
  });

  async function submit() {
    loading.value = true;

    try {
      const result = await loginApi.login(form);
      authStore.setCurrentUser(result);
      await workspaceStore.loadSwitchable();
      feedback.success(t.auth.loginSuccess);
      await router.push(typeof route.query.redirect === 'string' ? route.query.redirect : '/');
    } catch {
      feedback.error(t.auth.loginFailed);
    } finally {
      loading.value = false;
    }
  }

  return {
    form,
    loading,
    submit
  };
}
