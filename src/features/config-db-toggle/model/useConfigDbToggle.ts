import { ref } from 'vue';

import { configCenterApi } from '@entities/config-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useConfigDbToggle() {
  const toggling = ref(false);

  async function toggleDbConnection(id: number | string, nextStatus: number, workspaceCode?: string) {
    const workspaceStore = useWorkspaceStore();
    toggling.value = true;

    try {
      await configCenterApi.updateDbConnectionStatus(
        id,
        nextStatus,
        workspaceCode || workspaceStore.currentWorkspace.code
      );
      feedback.success(t.configCenter.dbStatusUpdateSuccess);
      return true;
    } catch {
      feedback.error(t.configCenter.dbStatusUpdateFailed);
      return false;
    } finally {
      toggling.value = false;
    }
  }

  return {
    toggling,
    toggleDbConnection
  };
}
