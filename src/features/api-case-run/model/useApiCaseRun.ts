import { ref } from 'vue';

import { apiAutomationApi, type ApiRunResponse } from '@entities/api-automation';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useApiCaseRun() {
  const running = ref(false);
  const result = ref<ApiRunResponse | null>(null);

  async function runCase(
    id: number | string,
    environmentId?: number | null,
    variableSetId?: number | null
  ) {
    const workspaceStore = useWorkspaceStore();
    running.value = true;

    try {
      result.value = await apiAutomationApi.runCase(
        id,
        {
          workspaceCode: workspaceStore.currentWorkspace.code,
          environmentId,
          variableSetId
        },
        workspaceStore.currentWorkspace.code
      );
      feedback.success(t.apiAutomation.caseRunSuccess);
      return result.value;
    } catch {
      feedback.error(t.apiAutomation.caseRunFailed);
      return null;
    } finally {
      running.value = false;
    }
  }

  return {
    running,
    result,
    runCase
  };
}
