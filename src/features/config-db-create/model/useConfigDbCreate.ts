import { ref } from 'vue';

import {
  configCenterApi,
  createDefaultDbConnectionForm,
  toSaveDbConnectionPayload,
  type DbConnectionFormValues
} from '@entities/config-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useConfigDbCreate() {
  const visible = ref(false);
  const saving = ref(false);
  const form = ref<DbConnectionFormValues>(createDefaultDbConnectionForm());

  function resetForm() {
    form.value = createDefaultDbConnectionForm();
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

    if (!form.value.connectionName.trim() || !form.value.dbType.trim() || !form.value.jdbcUrl.trim()) {
      feedback.warning(t.configCenter.dbRequiredFieldsMissing);
      return false;
    }

    saving.value = true;

    try {
      const workspaceCode = workspaceStore.writableWorkspaceCode;
      if (!workspaceCode) {
        feedback.warning(t.configCenter.workspaceRequiredForWrite);
        return false;
      }
      await configCenterApi.createDbConnection(
        toSaveDbConnectionPayload(form.value, workspaceCode),
        workspaceCode
      );
      feedback.success(t.configCenter.dbCreateSuccess);
      close();
      resetForm();
      return true;
    } catch {
      feedback.error(t.configCenter.dbCreateFailed);
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
