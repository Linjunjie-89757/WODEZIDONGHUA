import { computed } from 'vue';

import { useWorkspaceStore } from '@entities/workspace';

export function useHeaderState() {
  const workspaceStore = useWorkspaceStore();

  return {
    workspaceName: computed(() => workspaceStore.currentWorkspace.name)
  };
}
