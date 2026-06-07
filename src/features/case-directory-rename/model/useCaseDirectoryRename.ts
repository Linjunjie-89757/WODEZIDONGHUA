import { ref } from 'vue';

import {
  caseCenterApi,
  createCaseDirectoryEditForm,
  createDefaultCaseDirectoryForm,
  toRenameCaseDirectoryPayload,
  type CaseDirectoryFormValues,
  type CaseDirectoryNode
} from '@entities/case-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useCaseDirectoryRename() {
  const visible = ref(false);
  const saving = ref(false);
  const current = ref<CaseDirectoryNode | null>(null);
  const form = ref<CaseDirectoryFormValues>(createDefaultCaseDirectoryForm());

  function open(node: CaseDirectoryNode) {
    current.value = node;
    form.value = createCaseDirectoryEditForm(node.name);
    visible.value = true;
  }

  function close() {
    visible.value = false;
  }

  async function submit() {
    if (!current.value) {
      return false;
    }

    if (!form.value.name.trim()) {
      feedback.warning(t.caseCenter.directoryNameRequired);
      return false;
    }

    const workspaceStore = useWorkspaceStore();
    saving.value = true;

    try {
      const workspaceCode = current.value.workspaceCode || workspaceStore.currentWorkspace.code;
      await caseCenterApi.renameDirectory(
        current.value.id,
        toRenameCaseDirectoryPayload(form.value),
        workspaceCode
      );
      feedback.success(t.caseCenter.directoryRenameSuccess);
      close();
      return true;
    } catch {
      feedback.error(t.caseCenter.directoryRenameFailed);
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    visible,
    saving,
    current,
    form,
    open,
    close,
    submit
  };
}
