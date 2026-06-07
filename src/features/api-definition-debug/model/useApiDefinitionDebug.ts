import { ref } from 'vue';

import { apiAutomationApi, type ApiRunResponse } from '@entities/api-automation';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useApiDefinitionDebug() {
  const debugging = ref(false);
  const result = ref<ApiRunResponse | null>(null);
  const errorMessage = ref('');

  async function debugDefinition(
    id: number | string,
    environmentId?: number | null,
    variableSetId?: number | null
  ) {
    const workspaceStore = useWorkspaceStore();
    const workspaceCode = workspaceStore.currentWorkspace.code;
    debugging.value = true;
    errorMessage.value = '';

    try {
      result.value = await apiAutomationApi.debugDefinition(
        id,
        {
          workspaceCode,
          environmentId: environmentId || null,
          variableSetId: variableSetId || null
        },
        workspaceCode
      );
      feedback.success(t.apiAutomation.debugSuccess);
      return true;
    } catch {
      result.value = null;
      errorMessage.value = t.apiAutomation.debugFailed;
      feedback.error(t.apiAutomation.debugFailed);
      return false;
    } finally {
      debugging.value = false;
    }
  }

  return {
    debugging,
    result,
    errorMessage,
    debugDefinition
  };
}
