import { computed, onMounted, ref, watch } from 'vue';

import {
  caseCenterApi,
  countCaseDirectories,
  type CaseDirectoryWorkspace,
  type CaseSummaryItem
} from '@entities/case-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';

export function useCaseCenterReadonly() {
  const workspaceStore = useWorkspaceStore();
  const loading = ref(false);
  const errorMessage = ref('');
  const cases = ref<CaseSummaryItem[]>([]);
  const directories = ref<CaseDirectoryWorkspace[]>([]);
  const total = ref(0);

  const summary = computed(() => ({
    caseTotal: total.value,
    directoryTotal: countCaseDirectories(directories.value),
    reviewedTotal: cases.value.filter((item) => item.reviewStatus && item.reviewStatus !== 'PENDING').length,
    executedTotal: cases.value.filter(
      (item) => item.executionStatus && item.executionStatus !== 'NOT_EXECUTED'
    ).length
  }));

  async function loadReadonly() {
    loading.value = true;
    errorMessage.value = '';

    try {
      const workspaceCode = workspaceStore.currentWorkspace.code;
      const [directoryList, casePage] = await Promise.all([
        caseCenterApi.listDirectories(workspaceCode),
        caseCenterApi.listCases(workspaceCode, {
          pageNo: 1,
          pageSize: 20
        })
      ]);

      directories.value = directoryList;
      cases.value = casePage.items;
      total.value = casePage.total;
    } catch {
      directories.value = [];
      cases.value = [];
      total.value = 0;
      errorMessage.value = t.caseCenter.loadFailed;
    } finally {
      loading.value = false;
    }
  }

  onMounted(loadReadonly);

  watch(
    () => workspaceStore.currentWorkspace.code,
    () => {
      loadReadonly();
    }
  );

  return {
    loading,
    errorMessage,
    cases,
    directories,
    summary,
    loadReadonly
  };
}
