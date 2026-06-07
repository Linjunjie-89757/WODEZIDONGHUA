import { ref, watch } from 'vue';

import {
  apiAutomationApi,
  type ApiDefinitionCaseItem,
  type ApiDefinitionItem,
  type ApiRunResponse,
  type ApiScenarioDetail,
  type ApiScenarioItem,
  type ApiScenarioModuleItem
} from '@entities/api-automation';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';

export function useApiScenarioManagement(definitionsSource: () => ApiDefinitionItem[]) {
  const workspaceStore = useWorkspaceStore();
  const loading = ref(false);
  const detailLoading = ref(false);
  const errorMessage = ref('');
  const scenarios = ref<ApiScenarioItem[]>([]);
  const modules = ref<ApiScenarioModuleItem[]>([]);
  const cases = ref<ApiDefinitionCaseItem[]>([]);
  const selectedScenarioId = ref<number | null>(null);
  const selectedScenarioDetail = ref<ApiScenarioDetail | null>(null);
  const runResult = ref<ApiRunResponse | null>(null);

  async function loadScenarios() {
    loading.value = true;
    errorMessage.value = '';

    try {
      const [scenarioPage, moduleList, casePage] = await Promise.all([
        apiAutomationApi.listScenarios({}, workspaceStore.currentWorkspace.code),
        apiAutomationApi.listScenarioModules(workspaceStore.currentWorkspace.code),
        apiAutomationApi.listCases({}, workspaceStore.currentWorkspace.code)
      ]);
      scenarios.value = scenarioPage.items;
      modules.value = moduleList;
      cases.value = casePage.items;

      if (
        selectedScenarioId.value &&
        !scenarios.value.some((item) => item.id === selectedScenarioId.value)
      ) {
        selectedScenarioId.value = null;
      }
    } catch {
      scenarios.value = [];
      modules.value = [];
      cases.value = [];
      errorMessage.value = t.apiAutomation.scenarioLoadFailed;
    } finally {
      loading.value = false;
    }
  }

  async function selectScenario(id: number) {
    selectedScenarioId.value = id;
    detailLoading.value = true;

    try {
      selectedScenarioDetail.value = await apiAutomationApi.getScenarioDetail(
        id,
        workspaceStore.currentWorkspace.code
      );
    } catch {
      selectedScenarioDetail.value = null;
      errorMessage.value = t.apiAutomation.scenarioDetailLoadFailed;
    } finally {
      detailLoading.value = false;
    }
  }

  function setRunResult(result: ApiRunResponse) {
    runResult.value = result;
    if (selectedScenarioId.value) {
      selectScenario(selectedScenarioId.value);
    }
  }

  watch(
    () => workspaceStore.currentWorkspace.code,
    () => {
      selectedScenarioId.value = null;
      selectedScenarioDetail.value = null;
      runResult.value = null;
      loadScenarios();
    },
    { immediate: true }
  );

  return {
    loading,
    detailLoading,
    errorMessage,
    scenarios,
    modules,
    cases,
    definitions: definitionsSource,
    selectedScenarioId,
    selectedScenarioDetail,
    runResult,
    loadScenarios,
    selectScenario,
    setRunResult
  };
}
