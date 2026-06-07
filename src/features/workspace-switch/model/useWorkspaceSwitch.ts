import { computed, onMounted } from 'vue';

import { useWorkspaceStore } from '@entities/workspace';

export function useWorkspaceSwitch() {
  const workspaceStore = useWorkspaceStore();

  onMounted(() => {
    workspaceStore.ensureSwitchableLoaded();
  });

  function switchWorkspace(workspaceCode: string) {
    workspaceStore.setCurrentWorkspace(workspaceCode);
  }

  return {
    currentWorkspace: computed(() => workspaceStore.currentWorkspace),
    workspaceOptions: computed(() => workspaceStore.workspaceOptions),
    loading: computed(() => workspaceStore.loading),
    switchWorkspace
  };
}
