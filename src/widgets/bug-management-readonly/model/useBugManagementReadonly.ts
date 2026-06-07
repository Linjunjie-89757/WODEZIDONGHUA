import { computed, onMounted, ref, watch } from 'vue';

import { bugApi, type BugDetail, type BugStatistics, type BugSummary } from '@entities/bug';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';

const emptyStatistics = (): BugStatistics => ({
  total: 0,
  todo: 0,
  assigned: 0,
  inProgress: 0,
  pendingVerify: 0,
  closed: 0,
  rejected: 0
});

export function useBugManagementReadonly() {
  const workspaceStore = useWorkspaceStore();
  const loading = ref(false);
  const detailLoading = ref(false);
  const errorMessage = ref('');
  const detailErrorMessage = ref('');
  const bugs = ref<BugSummary[]>([]);
  const statistics = ref<BugStatistics>(emptyStatistics());
  const selectedBug = ref<BugDetail | null>(null);
  const detailVisible = ref(false);

  const visibleStatistics = computed(() => [
    { label: t.bugManagement.statsTotal, value: statistics.value.total },
    { label: t.bugManagement.statsTodo, value: statistics.value.todo },
    { label: t.bugManagement.statsInProgress, value: statistics.value.inProgress },
    { label: t.bugManagement.statsPendingVerify, value: statistics.value.pendingVerify },
    { label: t.bugManagement.statsClosed, value: statistics.value.closed }
  ]);

  async function loadReadonly() {
    loading.value = true;
    errorMessage.value = '';

    try {
      const workspaceCode = workspaceStore.currentWorkspace.code;
      const [nextStatistics, bugPage] = await Promise.all([
        bugApi.getStatistics(workspaceCode),
        bugApi.listBugs(workspaceCode)
      ]);

      statistics.value = nextStatistics;
      bugs.value = bugPage.items;
    } catch {
      statistics.value = emptyStatistics();
      bugs.value = [];
      errorMessage.value = t.bugManagement.loadFailed;
    } finally {
      loading.value = false;
    }
  }

  async function openDetail(bug: BugSummary) {
    detailVisible.value = true;
    detailLoading.value = true;
    detailErrorMessage.value = '';
    selectedBug.value = null;

    try {
      selectedBug.value = await bugApi.getBugDetail(bug.id, bug.workspaceCode);
    } catch {
      detailErrorMessage.value = t.bugManagement.detailLoadFailed;
    } finally {
      detailLoading.value = false;
    }
  }

  async function reloadSelectedDetail() {
    if (!selectedBug.value) {
      return;
    }

    detailLoading.value = true;
    detailErrorMessage.value = '';

    try {
      selectedBug.value = await bugApi.getBugDetail(
        selectedBug.value.id,
        selectedBug.value.workspaceCode
      );
      await loadReadonly();
    } catch {
      detailErrorMessage.value = t.bugManagement.detailLoadFailed;
    } finally {
      detailLoading.value = false;
    }
  }

  function closeDetail() {
    detailVisible.value = false;
    detailErrorMessage.value = '';
    selectedBug.value = null;
  }

  onMounted(loadReadonly);

  watch(
    () => workspaceStore.currentWorkspace.code,
    () => {
      closeDetail();
      loadReadonly();
    }
  );

  return {
    loading,
    detailLoading,
    errorMessage,
    detailErrorMessage,
    bugs,
    selectedBug,
    detailVisible,
    visibleStatistics,
    loadReadonly,
    openDetail,
    reloadSelectedDetail,
    closeDetail
  };
}
