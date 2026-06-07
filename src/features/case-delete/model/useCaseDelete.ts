import { ref } from 'vue';

import { caseCenterApi } from '@entities/case-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useCaseDelete() {
  const deleting = ref(false);

  async function deleteCase(id: number | string, workspaceCode?: string) {
    const workspaceStore = useWorkspaceStore();
    deleting.value = true;

    try {
      await caseCenterApi.deleteCase(id, workspaceCode || workspaceStore.currentWorkspace.code);
      feedback.success(t.caseCenter.deleteSuccess);
      return true;
    } catch {
      feedback.error(t.caseCenter.deleteFailed);
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
