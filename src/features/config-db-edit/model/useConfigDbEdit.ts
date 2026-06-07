import { ref } from 'vue';

import {
  configCenterApi,
  createDbConnectionEditForm,
  createDefaultDbConnectionForm,
  toSaveDbConnectionPayload,
  type DbConnectionFormValues,
  type DbConnectionItem
} from '@entities/config-center';
import { useWorkspaceStore } from '@entities/workspace';
import { t } from '@shared/i18n';
import { feedback } from '@shared/lib/feedback';

export function useConfigDbEdit() {
  const visible = ref(false);
  const saving = ref(false);
  const current = ref<DbConnectionItem | null>(null);
  const form = ref<DbConnectionFormValues>(createDefaultDbConnectionForm());

  function open(db: DbConnectionItem) {
    current.value = db;
    form.value = createDbConnectionEditForm(db);
    visible.value = true;
  }

  function close() {
    visible.value = false;
  }

  async function submit() {
    if (!current.value) {
      return false;
    }

    if (!form.value.connectionName.trim() || !form.value.dbType.trim() || !form.value.jdbcUrl.trim()) {
      feedback.warning(t.configCenter.dbRequiredFieldsMissing);
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
      await configCenterApi.updateDbConnection(
        current.value.id,
        toSaveDbConnectionPayload(form.value, workspaceCode),
        workspaceCode
      );
      feedback.success(t.configCenter.dbUpdateSuccess);
      close();
      return true;
    } catch {
      feedback.error(t.configCenter.dbUpdateFailed);
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
