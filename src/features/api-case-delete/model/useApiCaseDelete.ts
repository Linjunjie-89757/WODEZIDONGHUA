import { ref } from 'vue';

import { apiAutomationApi } from '@entities/api-automation';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useApiCaseDelete() {
  const deleting = ref(false);

  async function deleteCase(id: number | string) {
    const workspaceStore = useWorkspaceStore();
    deleting.value = true;

    try {
      await apiAutomationApi.deleteCase(id, workspaceStore.currentWorkspace.code);
      feedback.success(t.apiAutomation.caseDeleteSuccess);
      return true;
    } catch {
      feedback.error(t.apiAutomation.caseDeleteFailed);
      return false;
    } finally {
      deleting.value = false;
    }
  }

  return {
    deleting,
    deleteCase
  };
}
