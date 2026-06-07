import { ref } from 'vue';

import { configCenterApi } from '@entities/config-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useConfigParamToggle() {
  const toggling = ref(false);

  async function toggleParam(id: number | string, nextStatus: number, workspaceCode?: string) {
    const workspaceStore = useWorkspaceStore();
    toggling.value = true;

    try {
      await configCenterApi.updateParamStatus(
        id,
        nextStatus,
        workspaceCode || workspaceStore.currentWorkspace.code
      );
      feedback.success(t.configCenter.paramStatusUpdateSuccess);
      return true;
    } catch {
      feedback.error(t.configCenter.paramStatusUpdateFailed);
      return false;
    } finally {
      toggling.value = false;
    }
  }

  return {
    toggling,
    toggleParam
  };
}
