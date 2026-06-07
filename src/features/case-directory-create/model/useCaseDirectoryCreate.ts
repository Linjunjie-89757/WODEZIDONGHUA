import { ref } from 'vue';

import {
  caseCenterApi,
  createDefaultCaseDirectoryForm,
  toSaveCaseDirectoryPayload,
  type CaseDirectoryFormValues
} from '@entities/case-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useCaseDirectoryCreate() {
  const visible = ref(false);
  const saving = ref(false);
  const form = ref<CaseDirectoryFormValues>(createDefaultCaseDirectoryForm());
  const parentId = ref<number | null>(null);
  const targetWorkspaceCode = ref('');

  function resetForm() {
    form.value = createDefaultCaseDirectoryForm();
  }

  function open(options?: { parentId?: number | null; workspaceCode?: string }) {
    resetForm();
    parentId.value = options?.parentId ?? null;
    targetWorkspaceCode.value = options?.workspaceCode || '';
    visible.value = true;
  }

  function close() {
    visible.value = false;
  }

  async function submit() {
    if (!form.value.name.trim()) {
      feedback.warning(t.caseCenter.directoryNameRequired);
      return false;
    }

    const workspaceStore = useWorkspaceStore();
    saving.value = true;

    try {
      const workspaceCode = targetWorkspaceCode.value || workspaceStore.writableWorkspaceCode;
      if (!workspaceCode) {
        feedback.warning(t.configCenter.workspaceRequiredForWrite);
        return false;
      }
      await caseCenterApi.createDirectory(
        toSaveCaseDirectoryPayload(form.value, workspaceCode, parentId.value),
        workspaceCode
      );
      feedback.success(t.caseCenter.directoryCreateSuccess);
      close();
      resetForm();
      return true;
    } catch {
      feedback.error(t.caseCenter.directoryCreateFailed);
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    visible,
    saving,
    form,
    parentId,
    open,
    close,
    submit
  };
}
