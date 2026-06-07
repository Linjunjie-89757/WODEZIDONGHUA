import { ref } from 'vue';

import {
  apiAutomationApi,
  toSaveCasePayload,
  type ApiDefinitionCaseFormValues
} from '@entities/api-automation';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useApiCaseSave() {
  const saving = ref(false);

  async function saveCase(form: ApiDefinitionCaseFormValues, id?: number | string | null) {
    const workspaceStore = useWorkspaceStore();

    if (!form.definitionId || !form.name.trim() || !form.method.trim() || !form.path.trim()) {
      feedback.warning(t.apiAutomation.caseRequiredFieldsMissing);
      return false;
    }

    const workspaceCode = workspaceStore.writableWorkspaceCode;
    if (!workspaceCode) {
      feedback.warning(t.apiAutomation.workspaceRequiredForWrite);
      return false;
    }

    saving.value = true;

    try {
      const payload = toSaveCasePayload(form, workspaceCode);

      if (id) {
        await apiAutomationApi.updateCase(id, payload, workspaceCode);
        feedback.success(t.apiAutomation.caseUpdateSuccess);
      } else {
        await apiAutomationApi.createCase(payload, workspaceCode);
        feedback.success(t.apiAutomation.caseCreateSuccess);
      }

      return true;
    } catch {
      feedback.error(id ? t.apiAutomation.caseUpdateFailed : t.apiAutomation.caseCreateFailed);
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    saving,
    saveCase
  };
}
