import { computed, onMounted, ref, watch } from 'vue';

import type { AiConnection } from '@entities/ai-model';
import { aiModelApi } from '@entities/ai-model';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';

export function useAiConnectionPool() {
  const workspaceStore = useWorkspaceStore();
  const loading = ref(false);
  const errorMessage = ref('');
  const connections = ref<AiConnection[]>([]);

  const stats = computed(() => ({
    total: connections.value.length,
    ready: connections.value.filter((item) => item.status === 'ready').length,
    disabled: connections.value.filter((item) => !item.enabled).length
  }));

  async function loadConnections() {
    loading.value = true;
    errorMessage.value = '';

    try {
      connections.value = await aiModelApi.listConnections(workspaceStore.currentWorkspace.code);
    } catch {
      connections.value = [];
      errorMessage.value = t.aiConnection.loadFailed;
    } finally {
      loading.value = false;
    }
  }

  onMounted(loadConnections);

  watch(
    () => workspaceStore.currentWorkspace.code,
    () => {
      loadConnections();
    }
  );

  return {
    loading,
    errorMessage,
    connections,
    stats,
    loadConnections
  };
}
