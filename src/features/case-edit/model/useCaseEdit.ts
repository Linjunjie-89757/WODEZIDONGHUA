import { ref } from 'vue';

import {
  caseCenterApi,
  createCaseEditForm,
  createDefaultCaseForm,
  toSaveCasePayload,
  type CaseFormValues,
  type CaseSummaryItem
} from '@entities/case-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useCaseEdit() {
  const visible = ref(false);
  const loadingDetail = ref(false);
  const saving = ref(false);
  const current = ref<CaseSummaryItem | null>(null);
  const form = ref<CaseFormValues>(createDefaultCaseForm());

  async function open(caseItem: CaseSummaryItem) {
    current.value = caseItem;
    form.value = createCaseEditForm(caseItem);
    visible.value = true;

    const workspaceStore = useWorkspaceStore();
    loadingDetail.value = true;

    try {
      const workspaceCode = caseItem.workspaceCode || workspaceStore.currentWorkspace.code;
      const detail = await caseCenterApi.getCaseDetail(caseItem.id, workspaceCode);
      current.value = detail;
      form.value = createCaseEditForm(detail);
    } catch {
      feedback.warning(t.caseCenter.detailLoadFailed);
    } finally {
      loadingDetail.value = false;
    }
  }

  function close() {
    visible.value = false;
  }

  async function submit() {
    if (!current.value) {
      return false;
    }

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

    const workspaceStore = useWorkspaceStore();
    saving.value = true;

    try {
      const workspaceCode = current.value.workspaceCode || workspaceStore.writableWorkspaceCode;
      if (!workspaceCode) {
        feedback.warning(t.configCenter.workspaceRequiredForWrite);
        return false;
      }
      await caseCenterApi.updateCase(
        current.value.id,
        toSaveCasePayload(form.value, workspaceCode),
        workspaceCode
      );
      feedback.success(t.caseCenter.updateSuccess);
      close();
      return true;
    } catch {
      feedback.error(t.caseCenter.updateFailed);
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    visible,
    loadingDetail,
    saving,
    current,
    form,
    open,
    close,
    submit
  };
}
