import { ref } from 'vue';

import {
  apiAutomationApi,
  toSaveDefinitionPayload,
  type ApiDefinitionFormValues
} from '@entities/api-automation';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useApiDefinitionSave() {
  const saving = ref(false);

  async function saveDefinition(form: ApiDefinitionFormValues, id?: number | string | null) {
    const workspaceStore = useWorkspaceStore();

    if (!form.name.trim() || !form.method.trim() || !form.path.trim()) {
      feedback.warning(t.apiAutomation.requiredFieldsMissing);
      return false;
    }

    const workspaceCode = workspaceStore.writableWorkspaceCode;
    if (!workspaceCode) {
      feedback.warning(t.apiAutomation.workspaceRequiredForWrite);
      return false;
    }

    saving.value = true;

    try {
      const payload = toSaveDefinitionPayload(form, workspaceCode);

      if (id) {
        await apiAutomationApi.updateDefinition(id, payload, workspaceCode);
        feedback.success(t.apiAutomation.updateSuccess);
      } else {
        await apiAutomationApi.createDefinition(payload, workspaceCode);
        feedback.success(t.apiAutomation.createSuccess);
      }

      return true;
    } catch {
      feedback.error(id ? t.apiAutomation.updateFailed : t.apiAutomation.createFailed);
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    saving,
    saveDefinition
  };
}
