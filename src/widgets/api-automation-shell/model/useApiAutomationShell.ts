import { computed, onMounted, ref, watch } from 'vue';

import {
  apiAutomationApi,
  type ApiDefinitionItem,
  type ApiDefinitionModuleItem,
  type ApiEnvironmentItem,
  type ApiVariableSetItem
} from '@entities/api-automation';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';

function countModules(modules: ApiDefinitionModuleItem[]): number {
  return modules.reduce((total, module) => total + 1 + countModules(module.children || []), 0);
}

export function useApiAutomationShell() {
  const workspaceStore = useWorkspaceStore();
  const loading = ref(false);
  const errorMessage = ref('');
  const definitions = ref<ApiDefinitionItem[]>([]);
  const definitionModules = ref<ApiDefinitionModuleItem[]>([]);
  const environments = ref<ApiEnvironmentItem[]>([]);
  const variableSets = ref<ApiVariableSetItem[]>([]);
  const selectedDefinitionId = ref<number | null>(null);
  const selectedEnvironmentId = ref<number | null>(null);
  const selectedVariableSetId = ref<number | null>(null);
  const total = ref(0);

  const selectedDefinition = computed(
    () => definitions.value.find((item) => item.id === selectedDefinitionId.value) || null
  );

  const summary = computed(() => ({
    definitionTotal: total.value,
    moduleTotal: countModules(definitionModules.value),
    environmentTotal: environments.value.length,
    variableSetTotal: variableSets.value.length
  }));

  async function loadReadonly() {
    loading.value = true;
    errorMessage.value = '';

    try {
      const workspaceCode = workspaceStore.currentWorkspace.code;
      const [definitionPage, moduleList, environmentPage, variableSetPage] = await Promise.all([
        apiAutomationApi.listDefinitions(workspaceCode),
        apiAutomationApi.listDefinitionModules(workspaceCode),
        apiAutomationApi.listEnvironments(workspaceCode),
        apiAutomationApi.listVariableSets(workspaceCode)
      ]);

      definitions.value = definitionPage.items;
      definitionModules.value = moduleList;
      environments.value = environmentPage.items;
      variableSets.value = variableSetPage.items;
      total.value = definitionPage.total;

      if (
        selectedDefinitionId.value &&
        !definitions.value.some((item) => item.id === selectedDefinitionId.value)
      ) {
        selectedDefinitionId.value = null;
      }
    } catch {
      definitions.value = [];
      definitionModules.value = [];
      environments.value = [];
      variableSets.value = [];
      total.value = 0;
      errorMessage.value = t.apiAutomation.loadFailed;
    } finally {
      loading.value = false;
    }
  }

  function selectDefinition(id: number) {
    selectedDefinitionId.value = id;
  }

  onMounted(loadReadonly);

  watch(
    () => workspaceStore.currentWorkspace.code,
    () => {
      selectedDefinitionId.value = null;
      selectedEnvironmentId.value = null;
      selectedVariableSetId.value = null;
      loadReadonly();
    }
  );

  return {
    loading,
    errorMessage,
    definitions,
    definitionModules,
    environments,
    variableSets,
    selectedDefinition,
    selectedDefinitionId,
    selectedEnvironmentId,
    selectedVariableSetId,
    summary,
    loadReadonly,
    selectDefinition
  };
}
