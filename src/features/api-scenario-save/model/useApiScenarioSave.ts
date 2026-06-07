import { ref } from 'vue';

import {
  apiAutomationApi,
  toSaveScenarioPayload,
  type ApiScenarioFormValues
} from '@entities/api-automation';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useApiScenarioSave() {
  const saving = ref(false);

  async function saveScenario(form: ApiScenarioFormValues, id?: number | string | null) {
    const workspaceStore = useWorkspaceStore();

    if (!form.name.trim() || !form.steps.length) {
      feedback.warning(t.apiAutomation.scenarioRequiredFieldsMissing);
      return false;
    }

    const workspaceCode = workspaceStore.writableWorkspaceCode;
    if (!workspaceCode) {
      feedback.warning(t.apiAutomation.workspaceRequiredForWrite);
      return false;
    }

    saving.value = true;

    try {
      const payload = toSaveScenarioPayload(form, workspaceCode);

      if (id) {
        await apiAutomationApi.updateScenario(id, payload, workspaceCode);
        feedback.success(t.apiAutomation.scenarioUpdateSuccess);
      } else {
        await apiAutomationApi.createScenario(payload, workspaceCode);
        feedback.success(t.apiAutomation.scenarioCreateSuccess);
      }

      return true;
    } catch {
      feedback.error(id ? t.apiAutomation.scenarioUpdateFailed : t.apiAutomation.scenarioCreateFailed);
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    saving,
    saveScenario
  };
}
