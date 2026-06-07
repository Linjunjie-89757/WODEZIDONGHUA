import { ref } from 'vue';

import {
  caseCenterApi,
  createDefaultCaseForm,
  toSaveCasePayload,
  type CaseFormValues
} from '@entities/case-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useCaseCreate() {
  const visible = ref(false);
  const saving = ref(false);
  const form = ref<CaseFormValues>(createDefaultCaseForm());

  function resetForm() {
    form.value = createDefaultCaseForm();
  }

  function open() {
    resetForm();
    visible.value = true;
  }

  function close() {
    visible.value = false;
  }

  async function submit() {
    const workspaceStore = useWorkspaceStore();

    if (
      !form.value.title.trim() ||
      !form.value.caseType.trim() ||
      !form.value.priority.trim() ||
      !form.value.sourceType.trim() ||
      !form.value.caseStatus.trim()
    ) {
      feedback.warning(t.caseCenter.requiredFieldsMissing);
      return false;
    }

    saving.value = true;

    try {
      const workspaceCode = workspaceStore.writableWorkspaceCode;
      if (!workspaceCode) {
        feedback.warning(t.configCenter.workspaceRequiredForWrite);
        return false;
      }
      await caseCenterApi.createCase(toSaveCasePayload(form.value, workspaceCode), workspaceCode);
      feedback.success(t.caseCenter.createSuccess);
      close();
      resetForm();
      return true;
    } catch {
      feedback.error(t.caseCenter.createFailed);
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    visible,
    saving,
    form,
    open,
    close,
    submit
  };
}
