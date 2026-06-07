import { computed, onMounted, ref, watch } from 'vue';

import {
  configCenterApi,
  type DbConnectionItem,
  type EnvConfigItem,
  type ParamSetItem
} from '@entities/config-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';

export function useConfigCenterOverview() {
  const workspaceStore = useWorkspaceStore();
  const loading = ref(false);
  const errorMessage = ref('');
  const envs = ref<EnvConfigItem[]>([]);
  const params = ref<ParamSetItem[]>([]);
  const dbConnections = ref<DbConnectionItem[]>([]);

  const summary = computed(() => {
    const allItems = [...envs.value, ...params.value, ...dbConnections.value];

    return {
      envTotal: envs.value.length,
      paramTotal: params.value.length,
      dbTotal: dbConnections.value.length,
      enabledTotal: allItems.filter((item) => item.status === 1).length
    };
  });

  async function loadOverview() {
    loading.value = true;
    errorMessage.value = '';

    try {
      const workspaceCode = workspaceStore.currentWorkspace.code;
      const [envPage, paramPage, dbPage] = await Promise.all([
        configCenterApi.listEnvs(workspaceCode),
        configCenterApi.listParams(workspaceCode),
        configCenterApi.listDbConnections(workspaceCode)
      ]);

      envs.value = envPage.items;
      params.value = paramPage.items;
      dbConnections.value = dbPage.items;
    } catch {
      envs.value = [];
      params.value = [];
      dbConnections.value = [];
      errorMessage.value = t.configCenter.loadFailed;
    } finally {
      loading.value = false;
    }
  }

  onMounted(loadOverview);

  watch(
    () => workspaceStore.currentWorkspace.code,
    () => {
      loadOverview();
    }
  );

  return {
    loading,
    errorMessage,
    envs,
    params,
    dbConnections,
    summary,
    loadOverview
  };
}
