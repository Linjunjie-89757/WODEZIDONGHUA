import { ref } from 'vue';

import { configCenterApi } from '@entities/config-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useConfigDbDelete() {
  const deleting = ref(false);

  async function deleteDbConnection(id: number | string, workspaceCode?: string) {
    const workspaceStore = useWorkspaceStore();
    deleting.value = true;

    try {
      await configCenterApi.deleteDbConnection(
        id,
        workspaceCode || workspaceStore.currentWorkspace.code
      );
      feedback.success(t.configCenter.dbDeleteSuccess);
      return true;
    } catch {
      feedback.error(t.configCenter.dbDeleteFailed);
      return false;
    } finally {
      deleting.value = false;
    }
  }

  return {
    deleting,
    deleteDbConnection
  };
}
