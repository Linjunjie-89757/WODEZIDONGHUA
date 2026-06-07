import { ref } from 'vue';

import {
  configCenterApi,
  createDefaultEnvConfigForm,
  createEnvConfigEditForm,
  toSaveEnvConfigPayload,
  type EnvConfigFormValues,
  type EnvConfigItem
} from '@entities/config-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useConfigEnvEdit() {
  const visible = ref(false);
  const saving = ref(false);
  const current = ref<EnvConfigItem | null>(null);
  const form = ref<EnvConfigFormValues>(createDefaultEnvConfigForm());

  function open(env: EnvConfigItem) {
    current.value = env;
    form.value = createEnvConfigEditForm(env);
    visible.value = true;
  }

  function close() {
    visible.value = false;
  }

  async function submit() {
    if (!current.value) {
      return false;
    }

    if (!form.value.envType.trim() || !form.value.envName.trim() || !form.value.baseUrl.trim()) {
      feedback.warning(t.configCenter.envRequiredFieldsMissing);
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
      await configCenterApi.updateEnv(
        current.value.id,
        toSaveEnvConfigPayload(form.value, workspaceCode),
        workspaceCode
      );
      feedback.success(t.configCenter.envUpdateSuccess);
      close();
      return true;
    } catch {
      feedback.error(t.configCenter.envUpdateFailed);
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
