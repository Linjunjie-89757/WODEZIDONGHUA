import { ref } from 'vue';

import { configCenterApi } from '@entities/config-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useConfigEnvDelete() {
  const deleting = ref(false);

  async function deleteEnv(id: number | string, workspaceCode?: string) {
    const workspaceStore = useWorkspaceStore();
    deleting.value = true;

    try {
      await configCenterApi.deleteEnv(id, workspaceCode || workspaceStore.currentWorkspace.code);
      feedback.success(t.configCenter.envDeleteSuccess);
      return true;
    } catch {
      feedback.error(t.configCenter.envDeleteFailed);
      return false;
    } finally {
      deleting.value = false;
    }
  }

  return {
    deleting,
    deleteEnv
  };
}
