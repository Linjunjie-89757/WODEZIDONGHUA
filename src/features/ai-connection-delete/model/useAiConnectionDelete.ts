import { ref } from 'vue';

import { aiModelApi } from '@entities/ai-model';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useAiConnectionDelete() {
  const deleting = ref(false);

  async function deleteConnection(id: number | string) {
    const workspaceStore = useWorkspaceStore();

    deleting.value = true;

    try {
      await aiModelApi.deleteConnection(id, workspaceStore.currentWorkspace.code);
      feedback.success(t.aiConnection.deleteSuccess);
      return true;
    } catch {
      feedback.error(t.aiConnection.deleteFailed);
      return false;
    } finally {
      deleting.value = false;
    }
  }

  return {
    deleting,
    deleteConnection
  };
}
