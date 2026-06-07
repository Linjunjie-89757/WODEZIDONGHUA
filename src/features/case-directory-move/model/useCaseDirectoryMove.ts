import { ref } from 'vue';

import { caseCenterApi, toMoveCaseDirectoryPayload } from '@entities/case-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useCaseDirectoryMove() {
  const moving = ref(false);

  async function moveToRoot(id: number | string, workspaceCode?: string) {
    const workspaceStore = useWorkspaceStore();
    moving.value = true;

    try {
      await caseCenterApi.moveDirectory(
        id,
        toMoveCaseDirectoryPayload(null),
        workspaceCode || workspaceStore.currentWorkspace.code
      );
      feedback.success(t.caseCenter.directoryMoveSuccess);
      return true;
    } catch {
      feedback.error(t.caseCenter.directoryMoveFailed);
      return false;
    } finally {
      moving.value = false;
    }
  }

  return {
    moving,
    moveToRoot
  };
}
