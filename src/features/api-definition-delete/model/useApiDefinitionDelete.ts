import { ref } from 'vue';

import { apiAutomationApi } from '@entities/api-automation';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useApiDefinitionDelete() {
  const deleting = ref(false);

  async function deleteDefinition(id: number | string, workspaceCode?: string) {
    const workspaceStore = useWorkspaceStore();
    deleting.value = true;

    try {
      await apiAutomationApi.deleteDefinition(id, workspaceCode || workspaceStore.currentWorkspace.code);
      feedback.success(t.apiAutomation.deleteSuccess);
      return true;
    } catch {
      feedback.error(t.apiAutomation.deleteFailed);
      return false;
    } finally {
      deleting.value = false;
    }
  }

  return {
    deleting,
    deleteDefinition
  };
}
