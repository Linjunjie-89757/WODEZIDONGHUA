import { ref } from 'vue';

import { apiAutomationApi } from '@entities/api-automation';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useApiScenarioRun() {
  const running = ref(false);

  async function runScenario(
    id: number | string,
    environmentId?: number | null,
    variableSetId?: number | null
  ) {
    const workspaceStore = useWorkspaceStore();
    running.value = true;

    try {
      const result = await apiAutomationApi.runScenario(
        id,
        {
          workspaceCode: workspaceStore.currentWorkspace.code,
          environmentId,
          variableSetId
        },
        workspaceStore.currentWorkspace.code
      );
      feedback.success(t.apiAutomation.scenarioRunSuccess);
      return result;
    } catch {
      feedback.error(t.apiAutomation.scenarioRunFailed);
      return null;
    } finally {
      running.value = false;
    }
  }

  return {
    running,
    runScenario
  };
}
