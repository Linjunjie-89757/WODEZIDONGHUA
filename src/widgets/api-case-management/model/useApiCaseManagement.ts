import { computed, ref, watch } from 'vue';

import {
  apiAutomationApi,
  type ApiDefinitionCaseChangeHistoryItem,
  type ApiDefinitionCaseDetail,
  type ApiDefinitionCaseItem,
  type ApiDefinitionCaseRunHistoryItem,
  type ApiRunResponse
} from '@entities/api-automation';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';

export function useApiCaseManagement(definitionId: () => number | null) {
  const workspaceStore = useWorkspaceStore();
  const loading = ref(false);
  const detailLoading = ref(false);
  const errorMessage = ref('');
  const cases = ref<ApiDefinitionCaseItem[]>([]);
  const selectedCaseId = ref<number | null>(null);
  const selectedCaseDetail = ref<ApiDefinitionCaseDetail | null>(null);
  const runHistory = ref<ApiDefinitionCaseRunHistoryItem[]>([]);
  const changeHistory = ref<ApiDefinitionCaseChangeHistoryItem[]>([]);
  const runResult = ref<ApiRunResponse | null>(null);

  const selectedCase = computed(
    () => cases.value.find((item) => item.id === selectedCaseId.value) || null
  );

  async function loadCases() {
    if (!definitionId()) {
      cases.value = [];
      selectedCaseId.value = null;
      return;
    }

    loading.value = true;
    errorMessage.value = '';

    try {
      const page = await apiAutomationApi.listCases(
        { definitionId: definitionId() },
        workspaceStore.currentWorkspace.code
      );
      cases.value = page.items;

      if (selectedCaseId.value && !cases.value.some((item) => item.id === selectedCaseId.value)) {
        selectedCaseId.value = null;
      }
    } catch {
      cases.value = [];
      errorMessage.value = t.apiAutomation.caseLoadFailed;
    } finally {
      loading.value = false;
    }
  }

  async function selectCase(id: number) {
    selectedCaseId.value = id;
    detailLoading.value = true;

    try {
      const [detail, runs, changes] = await Promise.all([
        apiAutomationApi.getCaseDetail(id, workspaceStore.currentWorkspace.code),
        apiAutomationApi.listCaseRunHistory(id, workspaceStore.currentWorkspace.code),
        apiAutomationApi.listCaseChangeHistory(id, workspaceStore.currentWorkspace.code)
      ]);
      selectedCaseDetail.value = detail;
      runHistory.value = runs.items;
      changeHistory.value = changes.items;
    } catch {
      selectedCaseDetail.value = null;
      runHistory.value = [];
      changeHistory.value = [];
      errorMessage.value = t.apiAutomation.caseDetailLoadFailed;
    } finally {
      detailLoading.value = false;
    }
  }

  function setRunResult(result: ApiRunResponse) {
    runResult.value = result;
    if (selectedCaseId.value) {
      selectCase(selectedCaseId.value);
    }
  }

  watch(
    [definitionId, () => workspaceStore.currentWorkspace.code],
    () => {
      selectedCaseId.value = null;
      selectedCaseDetail.value = null;
      runHistory.value = [];
      changeHistory.value = [];
      runResult.value = null;
      loadCases();
    },
    { immediate: true }
  );

  return {
    loading,
    detailLoading,
    errorMessage,
    cases,
    selectedCase,
    selectedCaseId,
    selectedCaseDetail,
    runHistory,
    changeHistory,
    runResult,
    loadCases,
    selectCase,
    setRunResult
  };
}
