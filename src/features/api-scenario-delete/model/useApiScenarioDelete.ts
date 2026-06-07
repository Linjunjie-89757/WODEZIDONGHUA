import { ref } from 'vue';

import { apiAutomationApi } from '@entities/api-automation';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useApiScenarioDelete() {
  const deleting = ref(false);

  async function deleteScenario(id: number | string) {
    const workspaceStore = useWorkspaceStore();
    deleting.value = true;

    try {
      await apiAutomationApi.deleteScenario(id, workspaceStore.currentWorkspace.code);
      feedback.success(t.apiAutomation.scenarioDeleteSuccess);
      return true;
    } catch {
      feedback.error(t.apiAutomation.scenarioDeleteFailed);
      return false;
    } finally {
      deleting.value = false;
    }
  }

  return {
    deleting,
    deleteScenario
  };
}
