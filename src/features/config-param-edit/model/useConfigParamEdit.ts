import { ref } from 'vue';

import {
  configCenterApi,
  createDefaultParamSetForm,
  createParamSetEditForm,
  toSaveParamSetPayload,
  type ParamSetFormValues,
  type ParamSetItem
} from '@entities/config-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useConfigParamEdit() {
  const visible = ref(false);
  const saving = ref(false);
  const current = ref<ParamSetItem | null>(null);
  const form = ref<ParamSetFormValues>(createDefaultParamSetForm());

  function open(param: ParamSetItem) {
    current.value = param;
    form.value = createParamSetEditForm(param);
    visible.value = true;
  }

  function close() {
    visible.value = false;
  }

  async function submit() {
    if (!current.value) {
      return false;
    }

    if (!form.value.paramType.trim() || !form.value.paramName.trim()) {
      feedback.warning(t.configCenter.paramRequiredFieldsMissing);
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
      await configCenterApi.updateParam(
        current.value.id,
        toSaveParamSetPayload(form.value, workspaceCode),
        workspaceCode
      );
      feedback.success(t.configCenter.paramUpdateSuccess);
      close();
      return true;
    } catch {
      feedback.error(t.configCenter.paramUpdateFailed);
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
