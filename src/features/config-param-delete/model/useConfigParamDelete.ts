import { ref } from 'vue';

import { configCenterApi } from '@entities/config-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useConfigParamDelete() {
  const deleting = ref(false);

  async function deleteParam(id: number | string, workspaceCode?: string) {
    const workspaceStore = useWorkspaceStore();
    deleting.value = true;

    try {
      await configCenterApi.deleteParam(id, workspaceCode || workspaceStore.currentWorkspace.code);
      feedback.success(t.configCenter.paramDeleteSuccess);
      return true;
    } catch {
      feedback.error(t.configCenter.paramDeleteFailed);
      return false;
    } finally {
      deleting.value = false;
    }
  }

  return {
    deleting,
    deleteParam
  };
}
