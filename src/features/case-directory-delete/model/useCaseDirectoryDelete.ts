import { ref } from 'vue';

import { caseCenterApi } from '@entities/case-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useCaseDirectoryDelete() {
  const deleting = ref(false);

  async function deleteDirectory(id: number | string, workspaceCode?: string) {
    const workspaceStore = useWorkspaceStore();
    deleting.value = true;

    try {
      await caseCenterApi.deleteDirectory(
        id,
        workspaceCode || workspaceStore.currentWorkspace.code
      );
      feedback.success(t.caseCenter.directoryDeleteSuccess);
      return true;
    } catch {
      feedback.error(t.caseCenter.directoryDeleteFailed);
      return false;
    } finally {
      deleting.value = false;
    }
  }

  return {
    deleting,
    deleteDirectory
  };
}
