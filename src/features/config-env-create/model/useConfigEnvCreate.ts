import { ref } from 'vue';

import {
  configCenterApi,
  createDefaultEnvConfigForm,
  toSaveEnvConfigPayload,
  type EnvConfigFormValues
} from '@entities/config-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useConfigEnvCreate() {
  const visible = ref(false);
  const saving = ref(false);
  const form = ref<EnvConfigFormValues>(createDefaultEnvConfigForm());

  function resetForm() {
    form.value = createDefaultEnvConfigForm();
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

    if (!form.value.envType.trim() || !form.value.envName.trim() || !form.value.baseUrl.trim()) {
      feedback.warning(t.configCenter.envRequiredFieldsMissing);
      return false;
    }

    saving.value = true;

    try {
      const workspaceCode = workspaceStore.writableWorkspaceCode;
      if (!workspaceCode) {
        feedback.warning(t.configCenter.workspaceRequiredForWrite);
        return false;
      }
      await configCenterApi.createEnv(toSaveEnvConfigPayload(form.value, workspaceCode), workspaceCode);
      feedback.success(t.configCenter.envCreateSuccess);
      close();
      resetForm();
      return true;
    } catch {
      feedback.error(t.configCenter.envCreateFailed);
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
