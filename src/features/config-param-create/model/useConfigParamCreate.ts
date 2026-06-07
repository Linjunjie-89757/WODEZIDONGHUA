import { ref } from 'vue';

import {
  configCenterApi,
  createDefaultParamSetForm,
  toSaveParamSetPayload,
  type ParamSetFormValues
} from '@entities/config-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useConfigParamCreate() {
  const visible = ref(false);
  const saving = ref(false);
  const form = ref<ParamSetFormValues>(createDefaultParamSetForm());

  function resetForm() {
    form.value = createDefaultParamSetForm();
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

    if (!form.value.paramType.trim() || !form.value.paramName.trim()) {
      feedback.warning(t.configCenter.paramRequiredFieldsMissing);
      return false;
    }

    saving.value = true;

    try {
      const workspaceCode = workspaceStore.writableWorkspaceCode;
      if (!workspaceCode) {
        feedback.warning(t.configCenter.workspaceRequiredForWrite);
        return false;
      }
      await configCenterApi.createParam(
        toSaveParamSetPayload(form.value, workspaceCode),
        workspaceCode
      );
      feedback.success(t.configCenter.paramCreateSuccess);
      close();
      resetForm();
      return true;
    } catch {
      feedback.error(t.configCenter.paramCreateFailed);
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
